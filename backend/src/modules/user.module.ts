import { Module } from '@nestjs/common';
import { UserModel } from '../database/models';
import { UserEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  exports:[UserModel],
  imports: [
    MikroOrmModule.forFeature([UserEntity])
  ],
  providers: [UserModel],
})
export class UserModule {}
