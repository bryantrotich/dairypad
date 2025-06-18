import { Module } from '@nestjs/common';
import { ExpenseModel, PermissionModel } from '../database/models';
import { ExpenseEntity, PermissionEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [PermissionModel],
    imports:     [MikroOrmModule.forFeature([PermissionEntity])],
    providers:   [PermissionModel],
})
export class PermissionModule {}
