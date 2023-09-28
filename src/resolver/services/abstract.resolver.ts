import { LookupDto } from '../dto/lookup.dto';

export abstract class AbstractResolver {
  public abstract lookup(ip: string): Promise<LookupDto>;
}
