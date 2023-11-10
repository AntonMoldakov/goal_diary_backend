import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-store';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache & RedisStore) {}

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, { ttl }, null);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const data = await this.cacheManager.get<T>(key);

      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
