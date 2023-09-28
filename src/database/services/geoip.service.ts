import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Netmask } from 'netmask';
import { format, subDays } from 'date-fns';

import { RuleService } from './rule.service';
import { GeoipEntity } from '@database/entities/geoip.entity';
import { LookupDto } from '@database/dto/lookup.dto';
import { CompanyEntity } from '@database/entities/company.entity';
import { RuleEntity } from '@database/entities/rule.entity';
import { isIPv4 } from '@resolver/util/ip.util';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GeoipService {
  constructor(
    @InjectRepository(GeoipEntity)
    private readonly repo: Repository<GeoipEntity>,
    private readonly ruleService: RuleService,
  ) {}

  async findByIPList(ips: string[]): Promise<LookupDto[]> {
    const qb = this.repo.createQueryBuilder('geoip');
    const columns = [
      'geoip.ip',
      'geoip.isoCode',
      'geoip.country',
      'geoip.city',
      'geoip.loc',
      'geoip.asn',
      'geoip.hostname',
    ];

    const rows = await qb
      .select(columns)
      .leftJoinAndSelect(
        CompanyEntity,
        'company',
        'company.id = geoip.companyId',
      )
      .where({
        ip: In(ips),
        // updated: LessThanOrEqual('2022-01-01 00:00:00'),
      })
      .getRawMany();

    return rows.map((row) => {
      const loc = row.geoip_loc
        ? row.geoip_loc.split(',').map(parseFloat)
        : null;

      const company = {
        id: row.company_id,
        name: row.company_name,
        url: row.company_url,
        refUrl: row.company_ref_url,
      };

      return plainToInstance(LookupDto, {
        id: row.geoip_id,
        ip: row.geoip_ip,
        org: row.geoip_org,
        timezone: row.geoip_timezone,
        postal: row.geoip_postal,
        isoCode: row.geoip_isoCode
          ? row.geoip_isoCode.toLocaleLowerCase()
          : null,
        country: row.geoip_country,
        city: row.geoip_city,
        asn: row.geoip_asn,
        loc,
        company: company.id ? company : null,
      });
    });
  }

  async findByIP(ip: string): Promise<null | LookupDto> {
    const rows = await this.findByIPList([ip]);
    return rows?.[0] || null;
  }

  async getForRules(): Promise<
    Array<Pick<GeoipEntity, 'id' | 'ip' | 'hostname' | 'org' | 'companyId'>>
  > {
    const updated = format(subDays(new Date(), 14), 'yyyy-MM-dd HH:mm:ss');

    const qb = this.repo
      .createQueryBuilder('geoip')
      .select(['id', 'ip', 'hostname', 'org', 'companyId'])
      .where('updated < :updated', { updated });

    return qb.getRawMany();
  }

  async getForResolve(): Promise<GeoipEntity[]> {
    const updated = format(subDays(new Date(), 900), 'yyyy-MM-dd HH:mm:ss');

    const qb = this.repo
      .createQueryBuilder('geoip')
      .where('updated < :updated', { updated });

    return qb.getMany();
  }

  async save(input: Partial<GeoipEntity>) {
    return this.repo.save(input);
  }

  async saveBatch(input: Partial<GeoipEntity>[]) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(GeoipEntity)
      .values(input)
      .orUpdate([
        'hostname',
        'asn',
        'anycast',
        'city',
        'region',
        'country',
        'isoCode',
        'loc',
        'org',
        'postal',
        'timezone',
        'companyId',
        'updated',
      ])
      .execute();
  }

  public async extractCompany(
    geoip: Pick<GeoipEntity, 'hostname' | 'org' | 'ip'>,
    rules: RuleEntity[] = [],
  ): Promise<number> {
    const list = rules.length ? rules : await this.ruleService.find();

    for (const row of list) {
      const org = row.org ? row.org.toLocaleLowerCase() : null;
      const hostname = row.hostname ? row.hostname.toLocaleLowerCase() : null;

      if (
        org &&
        hostname &&
        geoip.org &&
        geoip.hostname &&
        geoip.org.toLocaleLowerCase().includes(org) &&
        geoip.hostname.toLocaleLowerCase().includes(hostname)
      ) {
        // org & hostname
        return row.company;
      }

      if (
        hostname &&
        geoip.hostname &&
        geoip.hostname.toLocaleLowerCase().includes(hostname)
      ) {
        // hostname
        return row.company;
      }

      if (org && geoip.org && geoip.org.toLocaleLowerCase().includes(org)) {
        // org
        return row.company;
      }

      if (row.ip && geoip.ip && isIPv4(geoip.ip)) {
        // ipv4
        const block = new Netmask(row.ip);

        if (block.contains(geoip.ip)) {
          return row.company;
        }
      }
    }

    return 0;
  }
}
