import { Entity, PrimaryKey, Property, ManyToOne, Cascade, HiddenProps } from '@mikro-orm/core';
import { RoleEntity, SocietyEntity } from './index';
import { Seed, SeederContext, SeedRelation } from 'nestjs-class-seeder';
import { Faker } from "@faker-js/faker";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  PREFERNOTSAY = "",
}

@Entity({ tableName: 'users' })
export class UserEntity {

  [HiddenProps]?: 'password' | 'token';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ nullable: true })
  address: string;

  @Property()
  first_name: string;

  @Property({ nullable: true, type: 'boolean', default: false })
  is_super: boolean;  

  @Property()
  last_name: string;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true, default: '254' })
  country_code: string;

  @Property({ nullable: true })
  email_verified_at: Date;

  @Property({
    nullable: true,
    type: 'string',
    default: Gender.PREFERNOTSAY,
  })
  gender: string;

  @Property({ nullable: true })
  image: string;

  @Property({ persist:  false})
  get name() {
    return `${this.first_name} ${this.last_name}`;
  }  

  @Seed(async (faker: Faker, ctx: SeederContext) => {
    return bcrypt.hash('password', 10);
  })
  @Property({ hidden: true })
  password: string;

  @Property({ nullable: true })
  phone_number: string;

  @ManyToOne(
    () => RoleEntity, 
    { 
      cascade:             [Cascade.ALL], 
      nullable:            false,
      eager:               true,
      referenceColumnName: 'id',
    }
  )
  role: RoleEntity;

  @ManyToOne(
    () => SocietyEntity, 
    { 
      nullable:            true,
      cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
      eager:               true,
      referenceColumnName: 'id',
    }
  )
  society: SocietyEntity;

  @Property({ hidden: true })
  token: string;

  @Property({ 
      serializer: (value) => moment(value).format('lll'), 
      nullable: true, 
      onCreate: () => new Date() 
  })
  created_at: Date; // Automatically set on creation

  @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date; // Automatically updated on modification

  @Property({ nullable: true })
  deleted_at: Date; // Nullable for soft deletes
}