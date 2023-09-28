import { Inject, Injectable, Logger } from '@nestjs/common';

import { GeoipService } from '@database/services/geoip.service';
import { AbstractResolver } from '@resolver/services/abstract.resolver';
import { AbstractJob } from './abstract.job';
import { RESOLVER } from '@resolver/resolver.const';

@Injectable()
export class ResolveJob extends AbstractJob {
  logger = new Logger(ResolveJob.name);

  constructor(
    private readonly geoipService: GeoipService,
    @Inject(RESOLVER)
    private readonly resolver: AbstractResolver,
  ) {
    super();
  }

  public async doWork() {
    const geoip = await this.geoipService.getForResolve();
    this.logger.debug(`${geoip.length} records for resolve`);

    for (const i in geoip) {
      const row = geoip[i];
      const lookup = await this.resolver.lookup(row.ip);

      await this.geoipService.save({
        ...lookup,
        loc: lookup?.loc ? lookup.loc.join(',') : null,
        updated: new Date(),
        id: row.id,
      });

      if (+i % 100 === 0) {
        this.logger.debug(`Processing.. ${i} of ${geoip.length} records`);
      }
    }
  }
}
