import { ForbiddenException, Injectable } from '@nestjs/common';
import { user } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCommentDto,
  EditCommentDto,
  RangeParamsDto,
  RangeWithIdDto,
} from './dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async getMyComments(user: user, params: RangeParamsDto) {
    const { start = 0, end = 10 } = params;

    const comments = await this.prismaService.comment.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,

        parent: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        replies: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true, // only id is enough. to count
          },
        },
      },
      skip: start,
      take: end - start,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!comments || comments.length === 0) {
      return [];
    }

    return comments.map((comment) => ({
      ...comment,
      repliesCount: comment.replies.length,
      parentUsername: comment.parent?.user.username || null,
    }));
  }

  async getAllComments(params: RangeParamsDto) {
    const { start = 0, end = 10 } = params;

    const cachedComments =
      await this.redisCacheService.getCachedComment(
        `allComments-${start}-${end}`,
      );

    if (cachedComments) {
      console.log('Cache hit for all comments');
      return cachedComments;
    }

    console.log(
      'Cache miss for all comments, fetching from database',
    );

    const comments = await this.prismaService.comment.findMany({
      where: {
        deletedAt: null,
        parentId: null, // only top-level comments
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
        parent: {
          select: {
            content: true,
            createdAt: true,
            updatedAt: true,
            replies: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true, // only id is enough. to count
              },
            },
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        replies: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true, // only id is enough. to count
          },
        },
      },
      skip: start,
      take: end - start,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!comments || comments.length === 0) {
      return [];
    }

    const allComments = comments.map((comment) => ({
      ...comment,
      repliesCount: comment.replies.length,
      parentContent: comment.parent?.content || null,
      parentCreatedAt: comment.parent?.createdAt || null,
      parentUpdatedAt: comment.parent?.updatedAt || null,
      parentUsername: comment.parent?.user.username || null,
      parentRepliesCount: comment.parent?.replies.length || 0,
    }));

    await this.redisCacheService.setCachedComment(
      `allComments-${start}-${end}`,
      allComments,
      20,
    );

    return allComments;
  }

  async getCommentById(params: RangeWithIdDto) {
    const { id, start = 0, end = 10 } = params;

    const cachedComment =
      await this.redisCacheService.getCachedComment(
        `${id}-${start}-${end}`,
      );

    if (cachedComment) {
      console.log('Cache hit for comment', id);
      return cachedComment;
    }

    console.log(
      'Cache miss for comment',
      id,
      'fetching from database',
    );

    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
        parent: {
          select: {
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                username: true,
              },
            },
            replies: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true, // only id is enough. to count
              },
            },
          },
        },
        replies: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                username: true,
              },
            },
            replies: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true, // only id is enough. to count
              },
            },
          },
          skip: start,
          take: end - start,

          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }

    const commentWithReplies = {
      ...comment,
      repliesCount: comment.replies.length,
      parentContent: comment.parent?.content || null,
      parentCreatedAt: comment.parent?.createdAt || null,
      parentUpdatedAt: comment.parent?.updatedAt || null,
      parentUsername: comment.parent?.user.username || null,
      parentRepliesCount: comment.parent?.replies.length || 0,
    };

    await this.redisCacheService.setCachedComment(
      `${id}-${start}-${end}`,
      commentWithReplies,
      20,
    );

    return commentWithReplies;
  }

  async createComment(user: user, commentDetails: CreateCommentDto) {
    const { parentId = null, content } = commentDetails;

    const comment = await this.prismaService.comment.create({
      data: {
        content,
        userId: user.id,
        parentId: parentId || undefined,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (parentId) {
      await this.redisCacheService.deleteCachedComment(
        `${parentId}-0-10`,
      );
    } else {
      await this.redisCacheService.deleteCachedComment(
        `allComments-0-10`,
      );
    }

    return {
      ...comment,
      parentId: parentId || null,
    };
  }

  async editComment(
    user: user,
    newContent: EditCommentDto,
    id: string,
  ) {
    const { content } = newContent;
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
        createdAt: true,
      },
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }
    if (comment.userId !== user.id) {
      throw new ForbiddenException(
        'You can only edit your own comments',
      );
    }

    if (comment.createdAt < new Date(Date.now() - 15 * 60 * 1000)) {
      throw new ForbiddenException(
        'You can only edit comments within 15 minutes of creation',
      );
    }

    const updatedComment = await this.prismaService.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        parentId: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!updatedComment.parentId) {
      const index = await this.prismaService.comment.count({
        where: {
          parentId: null,
          deletedAt: null,
          createdAt: {
            gt: updatedComment.createdAt,
          },
        },
      });

      const start = Math.floor(index / 10) * 10;
      const end = Math.ceil(index / 10) * 10;

      await this.redisCacheService.deleteCachedComment(
        `allComments-${start}-${end}`,
      );
    }

    await this.redisCacheService.deleteCachedComment(`${id}-0-10`);

    return { updatedComment };
  }

  async deleteComment(user: user, id: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }
    if (comment.userId !== user.id) {
      throw new ForbiddenException(
        'You can only delete your own comments',
      );
    }

    const deletedComment = await this.prismaService.comment.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        parentId: true,
        createdAt: true,
      },
    });

    if (!deletedComment.parentId) {
      const index = await this.prismaService.comment.count({
        where: {
          parentId: null,
          deletedAt: null,
          createdAt: {
            gt: deletedComment.createdAt,
          },
        },
      });

      const start = Math.floor(index / 10) * 10;
      const end = Math.ceil(index / 10) * 10;

      await this.redisCacheService.deleteCachedComment(
        `allComments-${start}-${end}`,
      );
    }

    await this.redisCacheService.deleteCachedComment(`${id}-0-10`);

    return { message: 'Comment deleted successfully' };
  }

  async restoreComment(user: user, id: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
        deletedAt: true,
      },
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }
    if (comment.userId !== user.id) {
      throw new ForbiddenException(
        'You can only restore your own comments',
      );
    }
    if (!comment.deletedAt) {
      throw new ForbiddenException('Comment is not deleted');
    }

    if (comment.deletedAt < new Date(Date.now() - 15 * 60 * 1000)) {
      throw new ForbiddenException(
        'You can only restore comments within 15 minutes of deletion',
      );
    }

    const restoredComment = await this.prismaService.comment.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
      select: {
        parentId: true,
        createdAt: true,
      },
    });

    if (!restoredComment.parentId) {
      const index = await this.prismaService.comment.count({
        where: {
          parentId: null,
          deletedAt: null,
          createdAt: {
            gt: restoredComment.createdAt,
          },
        },
      });

      const start = Math.floor(index / 10) * 10;
      const end = Math.ceil(index / 10) * 10;

      await this.redisCacheService.deleteCachedComment(
        `allComments-${start}-${end}`,
      );
    }

    await this.redisCacheService.deleteCachedComment(`${id}-0-10`);

    return { message: 'Comment restored successfully' };
  }
}
