import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreateSocietyValidation {

    @IsString()
    @IsNotEmpty()
    city: string

    @IsEmail()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsOptional()
    @Matches(/^\+\d{3}\s\d{3}\s\d{6}$/g,{ message: "Enter a valid email address."})
    phone_number: string    

}
