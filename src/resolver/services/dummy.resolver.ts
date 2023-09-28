import { plainToInstance } from 'class-transformer';
import { LookupDto } from '../dto/lookup.dto';
import { AbstractResolver } from './abstract.resolver';

export class DummyResolver extends AbstractResolver {
  public async lookup(ip: string) {
    return plainToInstance(LookupDto, {
      ip,
      hostname: `${ip.split('').reverse().join('')}.in-addr.arpa`,
      anycast: false,
      city: 'Moscow never sleeps',
      region: '',
      country: 'Russia',
      isoCode: 'ru',
      loc: null,
      org: null,
      postal: '103132',
      timezone: '+03:00',
      asn: null,
    } as LookupDto);
  }
}
