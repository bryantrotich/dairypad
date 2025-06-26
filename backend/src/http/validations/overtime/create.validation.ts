import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateOvertimeValidation {

    @IsString()
    @IsNotEmpty()
    date: string 
    
    @IsString()
    @IsNotEmpty()
    employee: string
    
    @IsNumber()
    @IsNotEmpty()
    hours: number

    @IsNumber()
    @IsNotEmpty()
    hourly_rate: number    

    @IsString()
    @IsNotEmpty()
    notes: string     

}
