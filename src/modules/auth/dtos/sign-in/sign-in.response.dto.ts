import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({ format: 'byte' })
  accessToken: string;
}
