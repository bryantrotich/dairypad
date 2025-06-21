import { Enum } from '@mikro-orm/core';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateEmployeeValidation {

    @IsEmail()
    @IsNotEmpty()
    email: string
    
    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    role: string

    
}
