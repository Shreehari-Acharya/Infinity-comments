import { IsNotEmpty, IsString } from 'class-validator';

// we are not taking parentId because it will remain constant
export class EditCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
