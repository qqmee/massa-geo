import { Environment } from '@env';
import { Provider } from '@nestjs/common';
import { RESOLVER } from '@resolver/resolver.const';
import { DummyResolver } from '@resolver/services/dummy.resolver';
import { IpinfoResolver } from '@resolver/services/ipinfo.resolver';

export const ResolverProvider: Provider = {
  provide: RESOLVER,
  useFactory() {
    if (Environment.NODE_ENV === 'development') {
      return new DummyResolver();
    }

    return new IpinfoResolver();
  },
};
