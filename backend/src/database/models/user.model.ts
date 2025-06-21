import { Catch, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { ValidationError, SyntaxErrorException, NotFoundError, MetadataError, ExceptionConverter } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ModelException } from 'src/http/exceptions';

@Injectable()
@Catch(ValidationError, SyntaxErrorException, NotFoundError, MetadataError)
export default class UserModel extends EntityRepository<UserEntity>{
  
  private readonly logger = new Logger(UserModel.name);

  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(UserEntity)
    private repository: EntityRepository<UserEntity>,
  ) {
    super(repository.getEntityManager(), UserEntity) 
  }


  /**
   * Save the role in the database.
   *
   * This method persists the role to the database and flushes the changes to the database.
   * It is a wrapper around the persistAndFlush method of the EntityManager.
   *
   * @param {any} data - The data to be saved to the database.
   * @returns {UserEntity} The saved role.
   */
  async save(data: any): Promise<UserEntity> {
    try {
      // Create a new UserEntity
      let entity = this.create(data);

      // Persist the entity to the database and flush the changes
      await this.getEntityManager().persistAndFlush(entity);

      // Return the saved entity
      return entity;
    } catch (error) {
      // Log the error and throw an HTTP exception with the error message and status
      this.logger.log(error);
      throw new Error(error);
    }
  }

} 
