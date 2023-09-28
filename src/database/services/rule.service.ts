import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RuleEntity } from '../entities/rule.entity';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(RuleEntity)
    private readonly repo: Repository<RuleEntity>,
  ) {}

  public async find() {
    return this.repo.find({ loadRelationIds: true });
  }
}
