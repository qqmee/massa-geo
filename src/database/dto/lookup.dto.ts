import { ApiProperty, PickType } from '@nestjs/swagger';
import { CompanyEntity } from '@database/entities/company.entity';
import { GeoipEntity } from '@database/entities/geoip.entity';

export class LookupDto extends PickType(GeoipEntity, [
  'ip',
  'isoCode',
  'country',
  'city',
  'asn',
  'hostname',
] as const) {
  @ApiProperty({ type: [Number], nullable: true, example: [-100, 0.01] })
  readonly loc: null | number[];

  @ApiProperty({ type: CompanyEntity })
  readonly company: CompanyEntity;
}
