import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './common/modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersService } from './modules/users/services/users.service';
import { UsersModule } from './modules/users/users.module';
import { HashingModule } from './common/modules/hashing/hashing.module';
import { MailsModule } from './common/modules/mails/mails.module';
import { CacheModule } from './common/modules/cache/cache.module';
import { TasksModule } from './modules/tasks/tasks.module';
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
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useClass: CacheConfigService,
    // }),
    CacheModule,

    // CacheModule.register<RedisClientOptions>({
    //   isGlobal: true,
    //   store: redisStore as unknown as CacheStore,
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    // }),
    AuthModule,
    UsersModule,
    TasksModule,
    HashingModule,
    MailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
