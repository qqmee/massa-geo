import { performance } from 'node:perf_hooks';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';

import {
  CRON_INTERVAL_RESOLVE,
  CRON_INTERVAL_RULE,
  LOCKER,
} from '../cron.const';
import { Locker } from '@libs/locker';
import { RuleJob } from '../jobs/rule.job';
import { ResolveJob } from '../jobs/resolve.job';
import { AbstractJob } from '../jobs/abstract.job';

@Injectable()
export class WorkerService {
  logger = new Logger(WorkerService.name);

  public constructor(
    @Inject(LOCKER) private readonly locker: Locker,
    private readonly ruleJob: RuleJob,
    private readonly resolveJob: ResolveJob,
  ) {}

  @Timeout(3_000)
  public async lazyStart() {
    await this.rule();
    await this.resolve();
  }

  @Cron(CRON_INTERVAL_RESOLVE)
  public resolve() {
    return this.decorator(this.resolveJob);
  }

  @Cron(CRON_INTERVAL_RULE)
  public rule() {
    return this.decorator(this.ruleJob);
  }

  private async decorator(job: AbstractJob) {
    const jobName = job.getName();

    if (this.locker.isLocked(jobName)) {
      this.logger.warn(`${jobName} is locked`);
      return;
    }

    this.locker.lock(jobName);
    this.logger.debug(`${jobName} has been started`);

    const start = performance.now();

    try {
      await job.doWork();
    } catch (error) {
      this.logger.error(error);
    }

    const elapsed = (performance.now() - start).toFixed(2);
    this.logger.log(`${jobName} finished in time: ${elapsed}ms`);

    this.locker.unlock(jobName);
  }
}
