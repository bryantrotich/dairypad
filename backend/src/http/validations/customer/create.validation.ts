import { Enum } from '@mikro-orm/core';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateCustomerValidation {

    @IsString()
    @IsOptional()
    address: string

    @IsString()
    @IsNotEmpty()
    @Enum(['daily','monthly','yearly'])
    billing_cycle: string

    @IsString()
    @IsOptional()
    contact_person: string

    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsNotEmpty()
    phone_number: string
    
    @IsString()
    @IsOptional()
    postal_code: string

    @IsString()
    @IsNotEmpty()
    @Enum(['account','cash'])    
    type: string    
    
}
