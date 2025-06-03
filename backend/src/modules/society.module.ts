import { Module } from '@nestjs/common';
import { SocietyModel } from '../database/models';
import { SocietyEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SocietyController } from 'src/http/controllers';

@Module({
    exports:     [SocietyModel],
    imports:     [MikroOrmModule.forFeature([SocietyEntity])],
    providers:   [SocietyModel],
})
export class SocietyModule {}
