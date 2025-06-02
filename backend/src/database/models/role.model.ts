import { Catch, Injectable } from '@nestjs/common';
import { RoleEntity } from '../entities';
import { ValidationError, SyntaxErrorException, NotFoundError, MetadataError } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
@Catch(ValidationError, SyntaxErrorException, NotFoundError, MetadataError)
export default class RoleModel extends EntityRepository<RoleEntity>{} 
