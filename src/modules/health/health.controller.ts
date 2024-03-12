import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly mongoose: MongooseHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    try {
      const data = await this.health.check([
        () => this.http.pingCheck('root', process.env.APP_URL),
        // the process should not use more than 300MB memory
        () =>
          this.memoryHealthIndicator.checkHeap(
            'memory heap',
            300 * 1024 * 1024,
          ),
        // The process should not have more than 300MB RSS memory allocated
        () =>
          this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
        () =>
          this.disk.checkStorage('storage', {
            path: '/',
            thresholdPercent: 0.9,
          }),
        () => this.mongoose.pingCheck('mongoose'),
      ]);
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
