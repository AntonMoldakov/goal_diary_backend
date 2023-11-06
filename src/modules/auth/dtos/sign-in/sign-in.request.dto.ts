import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH } from '../../auth.contants';

export class SignInRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ format: 'password' })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @IsNotEmpty()
  readonly password: string;
}
