import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SetPasswordValidation  {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(4,{message:"Password confirmation should not be less than 4 characters." })
    @Matches(SetPasswordValidation['password'],{message: "Password confirmation should match the password."})
    confirm_password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak.'})
    password: string;

}