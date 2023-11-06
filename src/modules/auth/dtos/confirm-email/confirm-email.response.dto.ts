import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailResponseDto {
  @ApiProperty({ format: 'byte' })
  accessToken: string;
}
