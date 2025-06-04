import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade, ManyToOne, Enum } from '@mikro-orm/core';
import { SocietyEntity } from './index';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity({ tableName: 'products' })
export class ProductEntity {

    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({ type: 'longtext'})
    description: string;

    @Property()
    name: string;

    @Property()
    price: number;

    @Property()
    quantity: number;

    @ManyToOne(
        () => SocietyEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            referenceColumnName: 'id',
        }
    )
    society: SocietyEntity;

    @Enum({ items: () => Status })
    status: string;
    
    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification
}