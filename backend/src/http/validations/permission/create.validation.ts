import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreatePermissionValidation {
    
    @IsString()
    @IsNotEmpty()
    action: string  

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    module: string  
    
}
