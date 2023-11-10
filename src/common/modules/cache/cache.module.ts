import { Global, Module } from '@nestjs/common';
import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { CacheConfigFactory } from './cache.config';
import { ConfigService } from '../config/config.service';

@Global()
@Module({
  imports: [
    CacheManagerModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: CacheConfigFactory,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
