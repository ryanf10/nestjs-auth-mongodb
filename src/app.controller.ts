import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheStore,
  CacheTTL,
} from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
  ) {}

  @Get()
  root() {
    return { data: { message: 'Hello world!' } };
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(50)
  @Get('hello')
  async getHello() {
    await this.cacheManager.set('hello', 'world', { ttl: 1000 });
    return { data: { message: this.appService.getHello() } };
  }
}
