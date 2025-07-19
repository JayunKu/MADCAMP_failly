import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;
  
  password: string;

  @IsNotEmpty()
  nickname: string;
}
