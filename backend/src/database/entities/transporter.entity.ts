import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade, ManyToOne, Enum } from '@mikro-orm/core';
import { SocietyEntity } from './index';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export enum Status {
  ACTIVE   = "active",
  DECEASED = "deceased",
  DORMANT  = "dormant",
  EXITED   = "exited",
}

@Entity({ tableName: 'transporters' })
export class TransporterEntity {

    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property()
    email: string;   

    @Property()
    first_name: string;
    
    @Property()
    id_number: string;

    @Property()
    last_name: string;

    @Property({ getter: true, persist: false })
    get full_name() { return `${this.first_name} ${this.last_name}`; }    
    
    @Property()
    surname: string;    

    @Property()
    phone_number: string;

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

    @Property()
    vehicle_registration: string;    

    @Property()
    vehicle_type: string;        
    
    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification
    
}