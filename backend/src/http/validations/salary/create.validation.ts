import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
export class CreateSalaryValidation {

    @IsBoolean()
    @IsNotEmpty()
    active: string   

    @IsNumber()
    @IsNotEmpty()
    amount: string

    @IsString()
    @IsNotEmpty()
    employee: string

    @IsString()
    @IsNotEmpty()
    start_date: string 
    
}
