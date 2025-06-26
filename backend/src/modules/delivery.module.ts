import { Module } from '@nestjs/common';
import { DeliveryModel } from '../database/models';
import { DeliveryEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [DeliveryModel],
    imports:     [MikroOrmModule.forFeature([DeliveryEntity])],
    providers:   [DeliveryModel],
})
export class DeliveryModule {}
