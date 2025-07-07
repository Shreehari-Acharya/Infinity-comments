import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCachedComment(commentId: string): Promise<{} | null> {
    const cacheKey = `comment:${commentId}`;
    const cachedComment = await this.cacheManager.get(cacheKey);
    if (cachedComment) {
      return cachedComment;
    }
    return null;
  }

  async setCachedComment(
    commentId: string,
    commentData: {},
    ttl: number,
  ): Promise<void> {
    const cacheKey = `comment:${commentId}`;
    await this.cacheManager.set(cacheKey, commentData, ttl * 1000);
  }

  async deleteCachedComment(commentId: string): Promise<void> {
    const cacheKey = `comment:${commentId}`;
    await this.cacheManager.del(cacheKey);
  }
}
