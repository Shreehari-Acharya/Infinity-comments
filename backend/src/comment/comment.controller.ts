import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  EditCommentDto,
  RangeParamsDto,
  RangeWithIdDto,
} from './dto';
import { User } from 'src/user/user.decorator';
import { user } from 'generated/prisma';
import { JwtGuard } from 'src/auth/gaurd';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('me')
  getMyComments(@User() user: user, @Param() params: RangeParamsDto) {
    return this.commentService.getMyComments(user, params);
  }

  @Get()
  getAllComments(@Param() params: RangeParamsDto) {
    return this.commentService.getAllComments(params);
  }

  @Get(':id')
  getCommentById(@Param() params: RangeWithIdDto) {
    return this.commentService.getCommentById(params);
  }

  @Post()
  createComment(
    @User() user: user,
    @Body() content: CreateCommentDto,
  ) {
    return this.commentService.createComment(user, content);
  }

  @Patch(':id')
  editComment(
    @User() user: user,
    @Body() content: EditCommentDto,
    @Param('id') id: string,
  ) {
    return this.commentService.editComment(user, content, id);
  }

  @Delete(':id')
  deleteComment(@User() user: user, @Param('id') id: string) {
    return this.commentService.deleteComment(user, id);
  }

  @Patch('/restore/:id')
  restoreComment(@User() user: user, @Param('id') id: string) {
    return this.commentService.restoreComment(user, id);
  }
}
