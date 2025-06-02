import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAuthValidation {

  @IsNotEmpty()
  @IsString()
  first_name: string

  @IsNotEmpty()
  @IsString()
  last_name: string

  @IsNotEmpty()
  @IsString()
  gender: string

  @IsNotEmpty()
  @IsString()
  phone_number: string

  @IsOptional()
  @IsString()
  image: string

}