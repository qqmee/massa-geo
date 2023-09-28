import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

import { FindCompaniesDto } from '@database/dto/find-companies.dto';
import { CompanyEntity } from '@database/entities/company.entity';
import { CompanyService } from '@database/services/company.service';

@Controller()
export class CompaniesController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/companies')
  @HttpCode(200)
  @ApiBody({ type: FindCompaniesDto })
  @ApiOkResponse({ type: [CompanyEntity] })
  batch(@Body() dto: FindCompaniesDto): Promise<CompanyEntity[]> {
    return this.companyService.find(dto);
  }
}
