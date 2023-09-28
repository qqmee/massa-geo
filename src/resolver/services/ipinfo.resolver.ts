import { IPinfoWrapper } from 'node-ipinfo';

import { Environment } from '@env';
import { AbstractResolver } from './abstract.resolver';
import { isIP } from '../util/ip.util';

export class IpinfoResolver extends AbstractResolver {
  private readonly ipinfo: IPinfoWrapper;

  public constructor() {
    super();

    this.ipinfo = new IPinfoWrapper(Environment.IPINFO_KEY);
  }

  public async lookup(ip: string) {
    if (!isIP(ip)) return null;

    const res = await this.ipinfo.lookupIp(ip);

    if (!res?.country || !res?.ip) {
      return {
        ip,
        hostname: null,
        anycast: null,
        city: null,
        region: null,
        country: null,
        isoCode: null,
        loc: null,
        org: null,
        postal: null,
        timezone: null,
        asn: null,
      };
    }

    const isoCode =
      res?.countryCode || (res?.country?.length === 2 ? res?.country : null);

    const asn = res?.org ? this.extractASN(res.org) : null;

    const loc = res?.loc
      ? res.loc.split(',').map((n) => parseInt(n, 10))
      : null;

    return {
      ip: res.ip,
      hostname: res?.hostname || null,
      anycast: Boolean(res?.anycast),
      city: res?.city || null,
      region: res?.region || null,
      country: res?.country || null,
      isoCode,
      loc,
      org: res?.org || null,
      postal: res?.postal || null,
      timezone: res?.timezone || null,
      asn,
    };
  }

  private extractASN(org: string): number | null {
    const match = /^AS([0-9]+).*/.exec(org);
    const value = match?.[1];

    return +value || null;
  }
}
