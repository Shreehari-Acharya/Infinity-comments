import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string; // determines if the comment is a reply to another comment
}
