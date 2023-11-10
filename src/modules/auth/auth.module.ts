import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { JWTConfigService } from './services/jwt-config.service';
import { UsersModule } from '../users/users.module';
import { HashingModule } from 'src/common/modules/hashing/hashing.module';
import { MailsModule } from 'src/common/modules/mails/mails.module';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    MailsModule,
    TypeOrmModule.forFeature([UserEntity]),
    HashingModule,
    JwtModule.registerAsync({
      useClass: JWTConfigService,
    }),
  ],
  providers: [
    AuthService,
    UsersRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
