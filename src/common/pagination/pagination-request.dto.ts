import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { DEFAULT_LIMIT } from './paginations-params.decorator';

export class PaginationRequestQueryDto {
  @ApiProperty({ default: 0 })
  @IsNumber()
  page: number;

  @ApiProperty({ default: DEFAULT_LIMIT })
  @IsNumber()
  limit?: number;
}
