import { SocietyEntity, UserEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Entity({ tableName: 'salaries' })
export class SalaryEntity {
  
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({
        type: 'boolean'
    })
    active: boolean;

    @Property({
        type: 'integer',
    })
    amount: number;    
    
    @Property({ 
        serializer: (value) => moment(value).format('ll'),
    })
    start_date: Date;

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

    @ManyToOne(
        () => UserEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            fieldName:           'user_id',
            referenceColumnName: 'id',
        }
    )
    user: UserEntity;      

    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification

}