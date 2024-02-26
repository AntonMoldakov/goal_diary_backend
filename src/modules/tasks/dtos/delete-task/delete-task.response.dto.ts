import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class DeleteTaskResponseDto {
  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
