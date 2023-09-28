import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Environment } from '@env';
import { CompanyEntity } from './entities/company.entity';
import { GeoipEntity } from './entities/geoip.entity';
import { RuleEntity } from './entities/rule.entity';
import { CompanyService } from './services/company.service';
import { GeoipService } from './services/geoip.service';
import { RuleService } from './services/rule.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, GeoipEntity, RuleEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: Environment.MYSQL_HOST,
      port: Environment.MYSQL_PORT,
      username: Environment.MYSQL_USER,
      password: Environment.MYSQL_PASSWORD,
      database: Environment.MYSQL_DATABASE,
      synchronize: Environment.NODE_ENV !== 'production',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // logging: true,
    }),
  ],
  providers: [CompanyService, GeoipService, RuleService],
  exports: [CompanyService, GeoipService, RuleService],
})
export class DatabaseModule {}
