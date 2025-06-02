import { EntityRepository } from '@mikro-orm/mysql';
import { RoleEntity } from '../entities'

export class RoleRepository extends EntityRepository<RoleEntity>{}