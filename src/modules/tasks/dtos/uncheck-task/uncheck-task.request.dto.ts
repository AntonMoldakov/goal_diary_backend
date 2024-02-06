import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UncheckTaskRequestDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}
