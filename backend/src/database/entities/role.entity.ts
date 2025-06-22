import { SocietyEntity, UserEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade, ManyToMany, Enum } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { PermissionEntity } from './permission.entity';

@Entity({ tableName: 'roles' })
export class RoleEntity {
  
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();
  
  @Property({ nullable: true, type: 'boolean', default: false })
  is_super: boolean;  

  @Property()
  name: string;
  
  @ManyToMany({
    entity: () => PermissionEntity,
    mappedBy: entity => entity.roles,
    type: Collection<PermissionEntity>,
  })
  permissions = new Collection<PermissionEntity>(this)

  @ManyToOne(
    () => SocietyEntity, 
    { 
      nullable:            false,
      cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
      fieldName:           'society_id',
      referenceColumnName: 'id',
    }
  )
  society: SocietyEntity;  

  @Enum({
    items: () => [2,1,0],
    nullable: true,
    default: 0
  })
  state: number;

  @OneToMany(
    () => UserEntity, 
    user => user.role 
  )
  users: Collection<UserEntity[]>  

  @Property({ 
    serializer: (value) => moment(value).format('lll'), 
    nullable: true, 
    onCreate: () => new Date() 
  })
  created_at: Date; // Automatically set on creation

  @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date; // Automatically updated on modification
}