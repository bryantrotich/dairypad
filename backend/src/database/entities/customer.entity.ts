import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade, ManyToOne, Enum } from '@mikro-orm/core';
import { SocietyEntity } from './index';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export enum BILLING_CYCLE {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly"
} 

export enum CUSTOMER_TYPE {
  ACCOUNT = "account",
  CASH    = "cash",
}

@Entity({ tableName: 'customers' })
export class CustomerEntity {

    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({ nullable: true })
    address: string;

    @Enum({ items: () => BILLING_CYCLE })
    billing_cycle: string;

    @Property({ nullable: true })
    contact_person: string;

    @Property()
    name: string;

    @Property()
    phone_number: string;    

    @Property({ nullable: true })
    postal_code: string;

    @ManyToOne(
        () => SocietyEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            referenceColumnName: 'id',
        }
    )
    society: SocietyEntity;    
    
    @Property({ nullable: true })
    town: string;

    @Enum({ items: () => CUSTOMER_TYPE })
    type: string;    
    
    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification
}