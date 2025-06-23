// import { Entity, Property, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { RoleEntity, RolePermissionEntity, SocietyEntity, UserEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade, ManyToMany } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Entity({ tableName: 'permissions' })
export class PermissionEntity {
  
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();
    
    @Property({
        nullable: true,
    })
    description: string;

    @Property()
    module: string;
    
    @Property({})
    name: string;      

    @ManyToMany({
        entity: () => RoleEntity,
        pivotEntity: () => RolePermissionEntity,
    })
    roles = new Collection<RoleEntity>(this)

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

    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification
}