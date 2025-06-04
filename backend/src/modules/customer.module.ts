import { Module } from '@nestjs/common';
import { CustomerModel } from '../database/models';
import { CustomerEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [CustomerModel],
    imports:     [MikroOrmModule.forFeature([CustomerEntity])],
    providers:   [CustomerModel],
})
export class CustomerModule {}
