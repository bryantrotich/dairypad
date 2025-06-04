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

    @IsNumber()
    @IsNotEmpty()
    name: string
    
    @IsNumber()
    @IsNotEmpty()
    phone_number: string
    
    @IsString()
    @IsOptional()
    postal_code: string

    @IsNumber()
    @IsNotEmpty()
    @Enum(['account','cash'])    
    type: string    
    
}
