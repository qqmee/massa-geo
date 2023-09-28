import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindCompaniesDto } from '@database/dto/find-companies.dto';
import { CompanyEntity } from '@database/entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>,
  ) {}

  public async find(dto: FindCompaniesDto) {
    const qb = this.repo.createQueryBuilder();

    if (dto.ids) {
      qb.andWhereInIds(dto.ids);
    }

    return qb.getMany();
  }
}
