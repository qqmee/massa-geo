import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ServiceType {
  Hosting = 'hosting',
  VPN = 'vpn',
}

@Entity({ name: 'companies' })
export class CompanyEntity implements Readonly<CompanyEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @ApiProperty({ enum: ServiceType, example: ['crypto', 'mir', 'visa'] })
  @Column({ type: 'enum', enum: ServiceType, default: ServiceType.Hosting })
  type?: ServiceType;

  @ApiProperty({ example: 'Google LLC' })
  @Column()
  name: string;

  @ApiProperty({ example: 'https://www.google.com', nullable: true })
  @Column({ nullable: true })
  url?: string;

  @ApiProperty({
    example: 'https://www.google.com/?utm_source=ref',
    nullable: true,
  })
  @Column({ nullable: true })
  refUrl?: string;

  @ApiProperty({ example: ['crypto', 'mir', 'visa'] })
  @Column({ type: 'json' })
  payments?: string[] = [];

  @ApiProperty({ example: ['ru', 'by'] })
  @Column({ type: 'json' })
  countries?: string[] = [];

  @ApiProperty({ example: 'HIVEFIVE discount VDS' })
  @Column({ nullable: true })
  promo?: string;
}
