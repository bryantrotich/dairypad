import { Module } from '@nestjs/common';
import { TransporterModel } from '../database/models';
import { TransporterEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [TransporterModel],
    imports:     [MikroOrmModule.forFeature([TransporterEntity])],
    providers:   [TransporterModel],
})
export class TransporterModule {}
