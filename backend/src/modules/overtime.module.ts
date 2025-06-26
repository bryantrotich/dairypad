import { Module } from '@nestjs/common';
import { OvertimeModel } from '../database/models';
import { OvertimeEntity } from '../database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
    exports:     [OvertimeModel],
    imports:     [MikroOrmModule.forFeature([OvertimeEntity])],
    providers:   [OvertimeModel],
})
export class OvertimeModule {}
