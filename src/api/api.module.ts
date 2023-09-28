import { Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { ResolverModule } from '@resolver/resolver.module';
import { CronModule } from '@cron/cron.module';
import { CompaniesController } from './controllers/companies.controller';
import { BatchController } from './controllers/batch.controller';
import { BatchComponent } from './components/batch.component';
import { Environment } from '@env';

@Module({
  imports: [
    DatabaseModule,
    ResolverModule,
    Environment.CRON && CronModule,
  ].filter(Boolean),
  controllers: [CompaniesController, BatchController],
  providers: [BatchComponent],
})
export class ApiModule {}
