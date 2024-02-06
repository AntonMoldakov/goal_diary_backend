import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CheckTaskRequestDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}
