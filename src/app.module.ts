import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './common/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersService } from './modules/users/services/users.service';
import { UsersModule } from './modules/users/users.module';
import { HashingModule } from './common/hashing/hashing.module';
import { MailsModule } from './common/mails/mails.module';

@Module({
  imports: [
    ConfigModule,
    // TODO: need to refactor
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: ['/src/**/*.entity.ts'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    HashingModule,
    MailsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
