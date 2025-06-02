import { Module } from '@nestjs/common';
import { CompanyModel } from '../database/models';
import { CompanyEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  exports:[CompanyModel],
  imports: [
    MikroOrmModule.forFeature([CompanyEntity])
  ],
  providers: [CompanyModel],
})
export class CompanyModule {}
