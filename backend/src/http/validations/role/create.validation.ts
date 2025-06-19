import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
export class CreateRoleValidation {

    @IsArray()
    @IsNotEmpty()
    permissions: any

    @IsString()
    @IsNotEmpty()
    name: string
    
}
