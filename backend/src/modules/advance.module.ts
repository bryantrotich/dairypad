import { Module } from '@nestjs/common';
import { AdvanceModel } from '../database/models';
import { AdvanceEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [AdvanceModel],
    imports:     [MikroOrmModule.forFeature([AdvanceEntity])],
    providers:   [AdvanceModel],
})
export class AdvanceModule {}
