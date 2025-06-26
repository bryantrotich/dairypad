import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade, ManyToOne, Enum } from '@mikro-orm/core';
import { SocietyEntity } from './index';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Entity({ tableName: 'farmers' })
export class FarmerEntity {

    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({ nullable: true })
    email: string;

    @Property()
    first_name: string;
    
    @Property()
    id_number: string;
    
    @Property()
    last_name: string;

    @Property({ persist:  false})
    get name() {
        return `${this.first_name} ${this.last_name} ${this.surname}`
    }      
    
    @Property()
    phone_number: string;
    
    @Property()
    surname: string;    

    @Enum({
        items: () => ['active','deceased','dormant','exited'],
    })
    status: string;   

    @ManyToOne(
        () => SocietyEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
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