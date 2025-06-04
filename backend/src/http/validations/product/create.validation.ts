import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateProductValidation {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    price: string
    
    @IsNumber()
    @IsNotEmpty()
    quantity: number
    
    @IsString()
    @IsNotEmpty()
    status: string    
    
}
