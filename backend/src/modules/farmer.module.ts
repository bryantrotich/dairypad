import { Module } from '@nestjs/common';
import { FarmerModel } from '../database/models';
import { FarmerEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [FarmerModel],
    imports:     [MikroOrmModule.forFeature([FarmerEntity])],
    providers:   [FarmerModel],
})
export class FarmerModule {}
