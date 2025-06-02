import { IsNotEmpty, IsString } from 'class-validator';

export class ResetAuthValidation  {

  @IsNotEmpty()
  @IsString()
  email: string

}