import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
export class CreateRoleValidation {

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    permissions: any

    @IsString()
    @IsNotEmpty()
    name: string
    
}
