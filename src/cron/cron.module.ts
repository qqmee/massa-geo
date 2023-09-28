import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ResolverModule } from '@resolver/resolver.module';
import { WorkerService } from './services/worker.service';
import { LockerProvider } from './providers/locker.provider';
import { RuleJob } from './jobs/rule.job';
import { ResolveJob } from './jobs/resolve.job';

@Module({
  imports: [ScheduleModule.forRoot(), ResolverModule],
  providers: [LockerProvider, WorkerService, RuleJob, ResolveJob],
})
export class CronModule {}
