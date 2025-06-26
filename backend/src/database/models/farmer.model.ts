import { Catch, Injectable } from '@nestjs/common';
import { FarmerEntity } from '../entities';
import { ValidationError, SyntaxErrorException, NotFoundError, MetadataError } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
@Catch(ValidationError, SyntaxErrorException, NotFoundError, MetadataError)
export default class FarmerModel extends EntityRepository<FarmerEntity>{
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(FarmerEntity)
    private repository: EntityRepository<FarmerEntity>,
  ) {
    super(repository.getEntityManager(), FarmerEntity) 
  }


  /**
   * Save the society in the database.
   *
   * This method persists the society to the database and flushes the changes to the database.
   * It is a wrapper around the persistAndFlush method of the EntityManager.
   *
   * @returns The saved society.
   */
  async save(data: any): Promise<void> {
    return await this.getEntityManager().persistAndFlush(this.create(data));
  }

} 
