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
  ResendCodeRequestDto,
  ResendCodeResponseDto,
  ForgotPasswordResponseDto,
  ForgotPasswordRequestDto,
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
  signUp(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm-email')
  @ApiOperation({ summary: 'confirm email' })
  @ApiBody({ type: () => ConfirmEmailRequestDto })
  @ApiOkResponse({ type: () => ConfirmEmailResponseDto })
  confirmEmail(@Body() dto: ConfirmEmailRequestDto): Promise<ConfirmEmailResponseDto> {
    return this.authService.confirmEmail(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-code')
  @ApiOperation({ summary: 'resend code' })
  @ApiBody({ type: () => ResendCodeRequestDto })
  @ApiOkResponse({ type: () => ResendCodeResponseDto })
  resendCode(@Body() dto: ResendCodeRequestDto): Promise<ResendCodeResponseDto> {
    return this.authService.resendCode(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ summary: 'forgot password' })
  @ApiBody({ type: () => ForgotPasswordRequestDto })
  @ApiOkResponse({ type: () => ForgotPasswordResponseDto })
  forgotPassword(@Body() dto: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({ summary: 'User sign-in' })
  @ApiBody({ type: () => SignInRequestDto })
  @ApiOkResponse({ type: () => SignInResponseDto })
  signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDto> {
    return this.authService.signIn(dto);
  }
}
