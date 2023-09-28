import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

import { BatchComponent } from '../components/batch.component';
import { FindIps } from '@database/dto/find-ips.dto';
import { LookupDto } from '@database/dto/lookup.dto';

@Controller()
export class BatchController {
  constructor(private readonly batchComponent: BatchComponent) {}

  @Post('/batch')
  @HttpCode(200)
  @ApiBody({ type: FindIps })
  @ApiOkResponse({ type: [LookupDto] })
  batch(@Body() dto: FindIps) {
    return this.batchComponent.resolve(dto);
  }
}
