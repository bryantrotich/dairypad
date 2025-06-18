import { Module } from '@nestjs/common';
import { RoleModel, RolePermissionModel } from '../database/models';
import { RoleEntity, RolePermissionEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  exports:   [RoleModel,RolePermissionModel],
  imports:   [MikroOrmModule.forFeature([RoleEntity,RolePermissionEntity])],
  providers: [RoleModel,RolePermissionModel],
})
export class RoleModule {}
