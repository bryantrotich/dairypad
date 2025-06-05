import { Enum } from '@mikro-orm/core';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateTransporterValidation {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    first_name: string
    
    @IsString()
    @IsNotEmpty()
    id_number: string

    @IsString()
    @IsNotEmpty()
    last_name: string
    
    @IsString()
    @IsNotEmpty()
    phone_number: string    

    @IsString()
    @IsNotEmpty()
    @Enum(['active','deceased','dormant','exited'])
    status: string

    @IsString()
    @IsNotEmpty()
    surname: string
        
    @IsString()
    @IsNotEmpty()
    vehicle_registration: string    

    @IsString()
    @IsNotEmpty()
    vehicle_type: string        

}