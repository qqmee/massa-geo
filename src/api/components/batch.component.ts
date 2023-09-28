import { Inject, Injectable } from '@nestjs/common';

import { AbstractResolver } from '@resolver/services/abstract.resolver';
import { RESOLVER } from '@resolver/resolver.const';
import { GeoipService } from '@database/services/geoip.service';
import { RuleService } from '@database/services/rule.service';
import { FindIps } from '@database/dto/find-ips.dto';
import { LookupDto } from '@database/dto/lookup.dto';
import { GeoipEntity } from '@database/entities/geoip.entity';

@Injectable()
export class BatchComponent {
  constructor(
    private readonly geoipService: GeoipService,
    private readonly ruleService: RuleService,
    @Inject(RESOLVER)
    private readonly resolver: AbstractResolver,
  ) {}

  public async resolve(dto: FindIps) {
    const rows = await this.geoipService.findByIPList(dto.ips);
    const unresolved = this.getNotResolved(dto.ips, rows);

    if (!unresolved.length) {
      // нечего подгружать из источника GeoIP, поэтому выходим
      return rows;
    }

    const resolved = await this.lookup(unresolved);
    return [...rows, ...resolved];
  }

  private getNotResolved(ips: string[], rows: LookupDto[]): string[] {
    const res = [...ips];

    for (const row of rows) {
      res.splice(res.indexOf(row.ip), 1);
    }

    return res;
  }

  private async lookup(ips: string[]) {
    const rules = await this.ruleService.find();

    const lookups: GeoipEntity[] = [];

    for (const ip of ips) {
      const lookup = await this.resolver.lookup(ip);
      const companyId = await this.geoipService.extractCompany(lookup, rules);

      lookups.push({
        ip: lookup.ip,
        hostname: lookup.hostname,
        asn: lookup.asn,
        anycast: lookup.anycast,
        city: lookup.city,
        region: lookup.region,
        country: lookup.country,
        isoCode: lookup.isoCode,
        loc: lookup.loc ? lookup.loc.join(',') : null,
        org: lookup.org,
        postal: lookup.postal,
        timezone: lookup.timezone,
        companyId,
        updated: new Date(),
      });
    }

    // save to db
    await this.geoipService.saveBatch(lookups);

    // get from db
    return this.geoipService.findByIPList(ips);
  }
}
