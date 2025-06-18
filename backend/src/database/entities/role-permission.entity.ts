// import { Entity, Property, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PermissionEntity, RoleEntity, SocietyEntity, UserEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Entity({ tableName: 'role_permissions' })
export class RolePermissionEntity {
  
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();  

    @ManyToOne(
        () => PermissionEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            fieldName:           'permission_id',
            referenceColumnName: 'id',
        }
    )
    permission: PermissionEntity;    

    @ManyToOne(
        () => RoleEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            fieldName:           'role_id',
            referenceColumnName: 'id',
        }
    )
    role: RoleEntity;    

    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification
}