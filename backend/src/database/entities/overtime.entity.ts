import { SocietyEntity, UserEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Entity({ tableName: 'overtime' })
export class OvertimeEntity {
  
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({ 
        serializer: (value) => moment(value).format('ll'),
    })
    date: Date;
        
    @Property({
        type: 'integer',
    })
    hours: number;   

    @Property({
        type: 'integer',
    })
    hourly_rate: number;    

    @Property({ type: 'text'})
    notes: string;       

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