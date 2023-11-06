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
import { HashingModule } from 'src/common/hashing/hashing.module';
import { MailsModule } from 'src/common/mails/mails.module';

@Module({
  imports: [
    UsersModule,
    MailsModule,
    TypeOrmModule.forFeature([UsersRepository]),
    HashingModule,
    JwtModule.registerAsync({
      useClass: JWTConfigService,
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
