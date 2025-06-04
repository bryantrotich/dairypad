import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { ProductEntity, UserEntity } from './index';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'societies' })
export class SocietyEntity {
  
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();
  
  @Property({ nullable: true })
  email: string;

  @Property()
  city: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  phone_number: string;

  @Property({ nullable: true, default: '254' })
  country_code: string;

  @OneToMany(
    () => ProductEntity, 
    product => product.society
  )
  products: Collection<ProductEntity[]>  

  @OneToMany(
    () => UserEntity, 
    user => user.society 
  )
  users: Collection<UserEntity[]>  

  @Property({ nullable: true, onCreate: () => new Date() })
  created_at: Date; // Automatically set on creation

  @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date; // Automatically updated on modification
}