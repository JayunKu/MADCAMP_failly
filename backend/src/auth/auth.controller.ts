import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup/signup';
import { LoginDto } from './dto/login/login';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  createUser(@Body() signupDto: SignupDto) {
    return this.authService.createUser(signupDto);
  }

  @Post('login')
  @HttpCode(201)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
