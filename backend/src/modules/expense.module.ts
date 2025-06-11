import { Module } from '@nestjs/common';
import { ExpenseModel } from '../database/models';
import { ExpenseEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [ExpenseModel],
    imports:     [MikroOrmModule.forFeature([ExpenseEntity])],
    providers:   [ExpenseModel],
})
export class ExpenseModule {}
