import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreateExpenseValidation {

    @IsString()
    @IsNotEmpty()
    amount: string

    @IsString()
    @IsNotEmpty()
    date: string

    @IsString()
    @IsOptional()
    description: string
    
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsOptional()
    transaction_id: string    

    @IsString()
    @IsNotEmpty()
    type: string    
    
}
