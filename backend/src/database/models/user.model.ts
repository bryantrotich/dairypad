import { Catch, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities';
import { ValidationError, SyntaxErrorException, NotFoundError, MetadataError } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
@Catch(ValidationError, SyntaxErrorException, NotFoundError, MetadataError)
export default class UserModel extends EntityRepository<UserEntity>{
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(UserEntity)
    private repository: EntityRepository<UserEntity>,
  ) {
    super(repository.getEntityManager(), UserEntity.name) 
  }
} 
