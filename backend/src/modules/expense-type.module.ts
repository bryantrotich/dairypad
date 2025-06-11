import { Module } from '@nestjs/common';
import { ExpenseTypeModel } from '../database/models';
import { ExpenseTypeEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [ExpenseTypeModel],
    imports:     [MikroOrmModule.forFeature([ExpenseTypeEntity])],
    providers:   [ExpenseTypeModel],
})
export class ExpenseTypeModule {}
