import { Module } from '@nestjs/common';
import { ProductModel } from '../database/models';
import { ProductEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [ProductModel],
    imports:     [MikroOrmModule.forFeature([ProductEntity])],
    providers:   [ProductModel],
})
export class ProductModule {}
