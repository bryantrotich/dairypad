import { Enum } from '@mikro-orm/core';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
export class CreateDeliveryValidation {

    @IsString()
    @IsNotEmpty()
    date: string

    @IsString()
    @IsNotEmpty()
    farmer: string         

    @IsString()
    @IsNotEmpty()
    quantity: string

    @IsString()
    @IsNotEmpty()
    @Enum(['evening','morning'])
    shift: string    

    @IsString()
    @IsNotEmpty()
    @Enum(['no','yes'])
    self_transported: string    

    @IsString()
    @IsOptional()
    @ValidateIf( v => v.self_transported == 'no' )
    transporter: string       
    
}
