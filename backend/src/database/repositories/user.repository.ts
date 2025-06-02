import { EntityRepository } from '@mikro-orm/mysql';
import { UserEntity } from '../entities'

export class UserRepository extends EntityRepository<UserEntity>{}