import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SecurityValidation {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Current password too weak.'})
  current_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'New password too weak.'})
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4,{message:"New password confirmation should not be less than 4 characters." })
  @Matches(SecurityValidation['new_password'],{message: "New password confirmation should match the new password."})
  confirm_new_password: string;

}