import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SignUpResponseDto {
  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
