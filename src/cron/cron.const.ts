import { CronExpression } from '@nestjs/schedule';

export const LOCKER = Symbol('LOCKER');

export const CRON_INTERVAL_RESOLVE = CronExpression.EVERY_11_HOURS;

export const CRON_INTERVAL_RULE = CronExpression.EVERY_10_HOURS;
