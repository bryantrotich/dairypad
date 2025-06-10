import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreateExpenseTypeValidation {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    name: string
    
}
