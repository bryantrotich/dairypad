import { Module } from '@nestjs/common';
import { RoleModel } from '../database/models';
import { RoleEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  exports:[RoleModel],
  imports: [
    MikroOrmModule.forFeature([RoleEntity])
  ],
  providers: [RoleModel],
})
export class RoleModule {}
