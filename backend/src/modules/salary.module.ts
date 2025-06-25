import { Module } from '@nestjs/common';
import { SalaryModel } from '../database/models';
import { SalaryEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [SalaryModel],
    imports:     [MikroOrmModule.forFeature([SalaryEntity])],
    providers:   [SalaryModel],
})
export class SalaryModule {}
