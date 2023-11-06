import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ConfirmEmailRequestDto,
  ConfirmEmailResponseDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../dtos';

import { Public } from '../decorators/public.decorator';

@Public()
@Controller('v1/auth')
@ApiTags('[v1] User Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  @ApiOperation({ summary: 'User sign-up' })
  @ApiBody({ type: () => SignUpRequestDto })
  @ApiOkResponse({ type: () => SignUpResponseDto })
  signUp(@Body() signUpDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm-email')
  @ApiOperation({ summary: 'confirm email' })
  @ApiBody({ type: () => ConfirmEmailRequestDto })
  @ApiOkResponse({ type: () => ConfirmEmailResponseDto })
  confirmEmail(@Body() confirmEmailDto: ConfirmEmailRequestDto): Promise<ConfirmEmailResponseDto> {
    return this.authService.confirmEmail(confirmEmailDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({ summary: 'User sign-in' })
  @ApiBody({ type: () => SignInRequestDto })
  @ApiOkResponse({ type: () => SignInResponseDto })
  signIn(@Body() signInDto: SignInRequestDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }
}
