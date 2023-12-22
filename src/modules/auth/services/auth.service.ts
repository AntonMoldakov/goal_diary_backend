import { ConflictException, Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailRequestDto, ResendCodeRequestDto, SignUpRequestDto, SignUpResponseDto } from '../dtos';
import { HashingService } from 'src/common/modules/hashing/services/abstract/hashing.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { randomUUID } from 'crypto';
import { pgUniqueViolationErrorCode } from 'src/common/constants/db';
import { SignInRequestDto } from '../dtos/sign-in/sign-in.request.dto';
import { ErrorKeys } from 'src/common/types/errors-keys';
import { UsersRepository } from 'src/modules/users/users.repository';
import { MailsService } from 'src/common/modules/mails/mails.service';
import { generateCode } from 'src/common/utils';
import { CODE_LENGTH } from '../auth.contants';

import { CacheService } from 'src/common/modules/cache/cache.service';
import { CacheUser } from '../types/cache-user';
import { ConfigService } from 'src/common/modules/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private mailsService: MailsService,
    private jwtService: JwtService,
    private hashingService: HashingService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  async signUp({ email, password }: SignUpRequestDto): Promise<SignUpResponseDto> {
    try {
      const user = await this.usersRepository.findOneBy({ email: email });

      if (user) {
        throw new ConflictException({
          message: 'User already exist',
          key: ErrorKeys.USER_ALREADY_EXISTS,
        });
      }

      const cashedUser = await this.cacheService.get<CacheUser>(email);

      if (cashedUser) {
        throw new HttpException({ message: 'Code sent', key: ErrorKeys.CODE_SENT }, 400);
      }

      const hashedPassword = await this.hashingService.hash(password);

      await this.generateAndSendCode(email, hashedPassword);

      return { status: true };
    } catch (error) {
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException({ message: 'User already exists', key: ErrorKeys.USER_ALREADY_EXISTS });
      }

      throw error;
    }
  }

  async confirmEmail({ email, code }: ConfirmEmailRequestDto) {
    const cashedUser = await this.cacheService.get<CacheUser>(email);

    if (!cashedUser) {
      throw new HttpException({ message: 'Code expired', key: ErrorKeys.CODE_EXPIRED }, 400);
    }

    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException({ message: 'User already exists', key: ErrorKeys.USER_ALREADY_EXISTS });
    }

    if (code !== cashedUser.code) {
      throw new HttpException({ message: 'Incorrect code', key: ErrorKeys.INCORRECT_CODE }, 400);
    }

    const newUser = await this.createUser(cashedUser.email, cashedUser.password);
    const accessToken = await this.jwtService.signAsync({ sub: newUser.id, email: newUser.email });

    return { accessToken };
  }

  async resendCode({ email }: ResendCodeRequestDto) {
    const cashedUser = await this.cacheService.get<CacheUser>(email);

    if (!cashedUser) {
      throw new HttpException(
        {
          message: 'Something went wrong, please try sing up again',
          key: ErrorKeys.CASHED_USER_DUES_NOT_EXIST,
        },
        400,
      );
    }

    const dateOfCreation = new Date(cashedUser.createdAt);
    const debounceDate = dateOfCreation;
    debounceDate.setSeconds(
      debounceDate.getSeconds() + this.configService.getNumber('CONFIRM_CODE_DEBOUNCE_TIME'),
    );

    if (debounceDate > new Date()) {
      const sendInSeconds = Math.ceil((debounceDate.getTime() - new Date().getTime()) / 1000);

      throw new HttpException(
        {
          message: `Code can be sent after ${sendInSeconds} seconds`,
          key: ErrorKeys.CODE_DEBOUNCE,
        },
        400,
      );
    }

    await this.generateAndSendCode(email, cashedUser.password);

    return { status: true };
  }

  private async generateAndSendCode(email: string, hashedPassword: string) {
    const code = generateCode(CODE_LENGTH);

    const cachedUser: CacheUser = {
      email: email,
      code,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await this.cacheService.set(email, cachedUser, this.configService.getNumber('CONFIRM_CODE_TTL'));

    await this.mailsService.sendConfirmEmailMail(email, code);
  }

  private async createUser(email: string, password: string) {
    const newUser = new UserEntity();

    newUser.id = randomUUID();
    newUser.email = email;
    newUser.password = password;

    const user = await this.usersRepository.save(newUser);

    return user;
  }

  async signIn(signInDto: SignInRequestDto) {
    const user = await this.usersRepository.findOneBy({ email: signInDto.email });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Email or password incorrect',
        key: ErrorKeys.EMAIL_OR_PASSWORD_INCORRECT,
      });
    }

    try {
      const isPasswordEqual = await this.hashingService.compare(signInDto.password, user.password);

      if (!isPasswordEqual) {
        throw new UnauthorizedException({
          message: 'Email or password incorrect',
          key: ErrorKeys.EMAIL_OR_PASSWORD_INCORRECT,
        });
      }

      const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });

      return { accessToken };
    } catch (error) {
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException({ message: 'User already exists', key: ErrorKeys.USER_ALREADY_EXISTS });
      }

      throw error;
    }
  }
}
