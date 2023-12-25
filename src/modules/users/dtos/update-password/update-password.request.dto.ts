import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
