import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginValidation {
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string

}