import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'rules' })
@Index('company_idx', ['company'])
export class RuleEntity implements Readonly<RuleEntity> {
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @ManyToOne(() => CompanyEntity, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'companyId' })
  company?: number;

  @Column({ nullable: true })
  hostname?: string;

  @Column({ nullable: true })
  org?: string;

  @Column({ unsigned: true, nullable: true })
  asn?: number;

  @Column({ nullable: true })
  ip?: string;
}
