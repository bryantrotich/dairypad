import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
export class CreateAdvanceValidation {

    @IsNumber()
    @IsNotEmpty()
    amount: string

    @IsEnum(['no','yes'])
    @IsNotEmpty()
    deduct_payroll: string    

    @IsString()
    @IsNotEmpty()
    employee: string

    @IsString()
    @IsNotEmpty()
    issued_on: string 

    @IsString()
    @IsNotEmpty()
    reason: string     

    @IsEnum(['no','yes'])
    @IsNotEmpty()
    recovered: string     
}
