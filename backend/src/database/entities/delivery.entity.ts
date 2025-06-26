import { SocietyEntity, TransporterEntity, UserEntity } from './index';
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Cascade, Enum } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { FarmerEntity } from './farmer.entity';

@Entity({ tableName: 'deliveries' })
export class DeliveryEntity {
  
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();  

    @Property({ 
        serializer: (value) => moment(value).format('ll'),
    })
    date: Date;

    @ManyToOne(
        () => FarmerEntity, 
        { 
            nullable:            false,
            cascade:             [Cascade.PERSIST, Cascade.REMOVE], 
            fieldName:           'farmer_id',
            referenceColumnName: 'id',
        }
    )
    farmer: FarmerEntity;      

    @Property({
        type: 'integer',
    })
    quantity: number;  

    @Enum({
        items: () => ['evening','morning'],
    })
    shift: string;  

    @Enum({
        items: () => ['no','yes'],
    })
    self_transported: string;      

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
        () => TransporterEntity, 
        { 
            nullable:            true,
            cascade:             [Cascade.PERSIST, Cascade.CANCEL_ORPHAN_REMOVAL], 
            fieldName:           'transport_id',
            referenceColumnName: 'id',
        }
    )
    transporter: TransporterEntity;     

    @Property({ 
        serializer: (value) => moment(value).format('lll'), 
        nullable: true, 
        onCreate: () => new Date() 
    })
    created_at: Date; // Automatically set on creation

    @Property({ nullable: true, onCreate: () => new Date(), onUpdate: () => new Date() })
    updated_at: Date; // Automatically updated on modification

}