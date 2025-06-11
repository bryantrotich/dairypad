import { ExpenseTypeEntity, SocietyEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Entity({ tableName: 'expenses' })
export class ExpenseEntity {
  
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({ type: 'double' })
    amount: number;
    
    @Property({ 
        serializer: (value) => moment(value).format('ll'), 
        type: 'date' 
    })
    date: Date;   

    @Property({ nullable: true })
    description: string; 

    @Property()
    name: string;

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
    transaction_id: string;

    @ManyToOne(
        () => ExpenseTypeEntity,
        { 
            eager:               true,
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            referenceColumnName: 'id',
        }
    )
    type: ExpenseTypeEntity;      


    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification

}