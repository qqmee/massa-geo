import { Injectable, Logger } from '@nestjs/common';

import { GeoipService } from '@database/services/geoip.service';
import { RuleService } from '@database/services/rule.service';
import { AbstractJob } from './abstract.job';

@Injectable()
export class RuleJob extends AbstractJob {
  logger = new Logger(RuleJob.name);

  constructor(
    private readonly geoipService: GeoipService,
    private readonly ruleService: RuleService,
  ) {
    super();
  }

  public async doWork() {
    const geoip = await this.geoipService.getForRules();
    const rules = await this.ruleService.find();

    this.logger.debug(`${geoip.length} records`);

    for (const i in geoip) {
      const row = geoip[i];
      const companyId = await this.geoipService.extractCompany(row, rules);

      if (row.companyId !== companyId) {
        await this.geoipService.save({
          id: row.id,
          companyId,
          updated: new Date(),
        });
      }

      if (+i % 10000 === 0) {
        this.logger.debug(`Processing.. ${i} of ${geoip.length} records`);
      }
    }
  }
}
