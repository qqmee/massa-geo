import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('geoip')
@Index('ip_uidx', ['ip'], { unique: true })
@Index('companyId_idx', ['companyId'])
export class GeoipEntity implements Readonly<GeoipEntity> {
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @ApiProperty({ example: '1.1.1.1' })
  @Column()
  ip: string;

  @ManyToOne(() => CompanyEntity, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'companyId' })
  companyId?: number = 0;

  @ApiProperty()
  @Column({ nullable: true })
  country?: string;

  @ApiProperty()
  @Column({ length: 2, nullable: true })
  isoCode?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  region?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  postal?: string;

  @ApiProperty({ nullable: true })
  @Column({ default: false, nullable: true })
  anycast?: boolean;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  hostname?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  loc?: string;

  @ApiProperty()
  @Column({ nullable: true })
  timezone?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  org?: string;

  @ApiProperty({ nullable: true })
  @Column({ unsigned: true, nullable: true })
  asn?: number;

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created?: Date;

  @Column({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated?: Date;
}
