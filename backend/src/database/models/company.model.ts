import { Catch, Injectable } from '@nestjs/common';
import { CompanyEntity } from '../entities';
import { ValidationError, SyntaxErrorException, NotFoundError, MetadataError } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
@Catch(ValidationError, SyntaxErrorException, NotFoundError, MetadataError)
export default class CompanyModel extends EntityRepository<CompanyEntity>{} 
