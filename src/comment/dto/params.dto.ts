import { IsOptional, IsNumber } from 'class-validator';
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
