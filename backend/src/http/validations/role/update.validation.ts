import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
export class UpdateRoleValidation {

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    permissions: any

    @IsString()
    @IsNotEmpty()
    name: string
    
}
