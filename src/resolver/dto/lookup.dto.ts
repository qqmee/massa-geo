export class LookupDto {
  readonly ip: string;
  readonly hostname: string;
  readonly anycast: boolean;
  readonly city: string;
  readonly region: string;
  readonly country: string;
  readonly isoCode: string;
  readonly loc: number[] | null;
  readonly org: string;
  readonly postal: string;
  readonly timezone: string;
  readonly asn: number | null;
}
