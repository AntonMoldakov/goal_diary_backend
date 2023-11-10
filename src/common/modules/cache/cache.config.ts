import { CacheModuleOptions } from '@nestjs/common';
import { ConfigService } from 'src/common/modules/config/config.service';
import { StoreConfig } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export const CacheConfigFactory = (
  configsService: ConfigService,
): Promise<CacheModuleOptions<StoreConfig>> | CacheModuleOptions<StoreConfig> => {
  return {
    isGlobal: true,
    max: 10_000,
    store: (): any =>
      redisStore({
        commandsQueueMaxLength: 10_000,
        socket: {
          host: configsService.getString('REDIS_HOST'),
          port: configsService.getNumber('REDIS_PORT'),
        },
      }),
  };
};
