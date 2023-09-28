import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIP } from 'class-validator';

import { getUniquePublicList } from '@resolver/util/ip.util';

export class FindIps {
  @ApiProperty({ type: [String], example: ['127.0.0.1', '1.1.1.1'] })
  @IsArray()
  @IsIP(null, { each: true })
  @ArrayMinSize(1)
  @Transform(({ value }) => getUniquePublicList(value))
  ips: string[];
}
