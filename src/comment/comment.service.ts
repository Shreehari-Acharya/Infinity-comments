import { ForbiddenException, Injectable } from '@nestjs/common';
import { user } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCommentDto,
  EditCommentDto,
  RangeParamsDto,
} from './dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

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

    const comments = await this.prismaService.comment.findMany({
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
      parentContent: comment.parent?.content || null,
      parentCreatedAt: comment.parent?.createdAt || null,
      parentUpdatedAt: comment.parent?.updatedAt || null,
      parentUsername: comment.parent?.user.username || null,
      parentRepliesCount: comment.parent?.replies.length || 0,
    }));
  }

  async getCommentById(id: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
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
          take: 10, // limit replies to 10
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }
    return {
      ...comment,
      repliesCount: comment.replies.length,
      parentContent: comment.parent?.content || null,
      parentCreatedAt: comment.parent?.createdAt || null,
      parentUpdatedAt: comment.parent?.updatedAt || null,
      parentUsername: comment.parent?.user.username || null,
      parentRepliesCount: comment.parent?.replies.length || 0,
    };
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
        user: {
          select: {
            username: true,
          },
        },
      },
    });

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

    await this.prismaService.comment.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

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

    await this.prismaService.comment.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });

    return { message: 'Comment restored successfully' };
  }
}
