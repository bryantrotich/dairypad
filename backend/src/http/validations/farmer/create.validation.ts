import { Enum } from '@mikro-orm/core';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreateFarmerValidation {

    @IsEmail()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
    email: string;

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string
    
    @IsString()
    @IsNotEmpty()
    id_number: string
    
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+\d{3}\s\d{3}\s\d{6}$/g,{ message: "Enter a valid email address."})
    phone_number: string    
    
    @IsString()
    @IsNotEmpty()
    @Enum(['active','deceased','dormant','exited'])
    status: string

    
}
