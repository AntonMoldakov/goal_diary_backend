import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailRequestDto, SignUpRequestDto, SignUpResponseDto } from '../dtos';
import { HashingService } from 'src/common/hashing/services/abstract/hashing.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { randomUUID } from 'crypto';
import { pgUniqueViolationErrorCode } from 'src/common/constants/db';
import { SignInRequestDto } from '../dtos/sign-in/sign-in.request.dto';
import { ErrorKeys } from 'src/common/types/errors-keys';
import { UsersRepository } from 'src/modules/users/users.repository';
import { MailsService } from 'src/common/mails/mails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private mailsService: MailsService,
    private jwtService: JwtService,
    private hashingService: HashingService,
  ) {}

  async signUp(signUpDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    try {
      const newUser = new UserEntity();

      newUser.id = randomUUID();
      newUser.email = signUpDto.email;
      newUser.password = await this.hashingService.hash(signUpDto.password);

      // TODO: refactor code
      const code = 1234;
      await this.mailsService.sendConfirmEmailMail(newUser.email, code);

      return { status: true };
    } catch (error) {
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException({ message: 'User already exists', key: ErrorKeys.USER_ALREADY_EXISTS });
      }

      throw error;
    }
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailRequestDto) {
    const user = await this.usersRepository.findOneBy({ email: confirmEmailDto.email });

    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist', key: ErrorKeys.USER_DOES_NOT_EXIST });
    }

    // TODO: need to check code

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { accessToken };
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
        throw new ConflictException({ message: 'User already exists', key: 'user_already_exists' });
      }

      throw error;
    }
  }
}
