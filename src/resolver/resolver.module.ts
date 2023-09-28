import { Module } from '@nestjs/common';
import { ResolverProvider } from './providers/resolver.provider';

@Module({
  providers: [ResolverProvider],
  exports: [ResolverProvider],
})
export class ResolverModule {}
