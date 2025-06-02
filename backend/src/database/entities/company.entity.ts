import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { RoleEntity, UserEntity } from './index';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'companies' })
export class CompanyEntity {
  
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ nullable: true })
  address: string;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true })
  logo: string;

  @Property({ nullable: true })
  icon: string;

  @Property({ nullable: true })
  phone_number: string;

  @Property({ nullable: true, default: '254' })
  country_code: string;

  @OneToMany(
    () => RoleEntity, 
    role => role.company 
  )
  roles: Collection<RoleEntity[]>

  @OneToMany(
    () => UserEntity, 
    user => user.company 
  )
  users: Collection<UserEntity[]>  

  @Property({ nullable: true, onCreate: () => new Date() })
  created_at: Date; // Automatically set on creation

  @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date; // Automatically updated on modification
}