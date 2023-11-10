import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailRequestDto, SignUpRequestDto, SignUpResponseDto } from '../dtos';
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
        throw new ConflictException({ message: 'Code sent', key: ErrorKeys.CODE_SENT });
      }

      const hashedPassword = await this.hashingService.hash(password);
      const code = generateCode(CODE_LENGTH);

      await this.cacheService.set(
        email,
        { email: email, code, password: hashedPassword },
        this.configService.getNumber('CONFIRM_CODE_TTL'),
      );

      await this.mailsService.sendConfirmEmailMail(email, code);

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
      throw new UnauthorizedException({ message: 'Code expired', key: ErrorKeys.CODE_EXPIRED });
    }

    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      throw new UnauthorizedException({ message: 'User already exists', key: ErrorKeys.USER_ALREADY_EXISTS });
    }

    if (code !== cashedUser.code) {
      throw new UnauthorizedException({ message: 'Incorrect code', key: ErrorKeys.INCORRECT_CODE });
    }

    const newUser = await this.createUser(cashedUser.email, cashedUser.password);
    const accessToken = await this.jwtService.signAsync({ sub: newUser.id, email: newUser.email });

    return { accessToken };
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
      throw new UnauthorizedException({ message: 'User does not exist', key: ErrorKeys.USER_DOES_NOT_EXIST });
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
