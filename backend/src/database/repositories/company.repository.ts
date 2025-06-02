import { EntityRepository } from '@mikro-orm/mysql';
import { CompanyEntity } from '../entities'

export class CompanyRepository extends EntityRepository<CompanyEntity>{}