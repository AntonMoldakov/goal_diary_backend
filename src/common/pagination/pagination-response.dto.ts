import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationMetaResponseDto {
  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;
}

export abstract class PaginatedResultDto<T extends Record<string, any>> {
  abstract data: T[];

  @ApiProperty({ type: PaginationMetaResponseDto })
  @Expose()
  @Type(() => PaginationMetaResponseDto)
  meta: PaginationMetaResponseDto;
}
