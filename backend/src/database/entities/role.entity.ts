// import { Entity, Property, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity, UserEntity } from './index';
import { Seed, SeederContext, SeedEnum, SeedRelation } from 'nestjs-class-seeder';
import { Faker } from "@faker-js/faker";
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'roles' })
export class RoleEntity {
  
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @ManyToOne(
    () => CompanyEntity, 
    { 
      cascade:             [Cascade.ALL], 
      referenceColumnName:      'id',
    }
  )
  company: CompanyEntity;

  @Property({
    unique: true
  })
  name: string;

  @Property({
    nullable: false,
  })
  state: number;

  @OneToMany(
    () => UserEntity, 
    user => user.role 
  )
  users: Collection<UserEntity[]>  

  @Property({ nullable: true, onCreate: () => new Date() })
  created_at: Date; // Automatically set on creation

  @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date; // Automatically updated on modification
}