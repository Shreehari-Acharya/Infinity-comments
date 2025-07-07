import {
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RangeParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  start?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  end?: number;
}

export class RangeWithIdDto extends RangeParamsDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
