import { Catch, Injectable } from '@nestjs/common';
import { RoleEntity } from '../entities';
import { ValidationError, SyntaxErrorException, NotFoundError, MetadataError, ExceptionConverter } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ModelException } from 'src/http/exceptions';

@Injectable()
@Catch(ValidationError, SyntaxErrorException, NotFoundError, MetadataError)
export default class RoleModel extends EntityRepository<RoleEntity>{
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(RoleEntity)
    private repository: EntityRepository<RoleEntity>,
  ) {
    super(repository.getEntityManager(), RoleEntity) 
  }


  /**
   * Save the role in the database.
   *
   * This method persists the role to the database and flushes the changes to the database.
   * It is a wrapper around the persistAndFlush method of the EntityManager.
   *
   * @param {any} data - The data to be saved to the database.
   * @returns {RoleEntity} The saved role.
   */
  async save(data: any): Promise<RoleEntity> {
    try {
      // Create a new RoleEntity
      let entity = this.create(data);

      // Persist the entity to the database and flush the changes
      await this.getEntityManager().persistAndFlush(entity);

      // Return the saved entity
      return entity;
    } catch (error) {
      // Log the error and throw an HTTP exception with the error message and status
      console.log(error);
      throw new Error(error);
    }
  }

} 
