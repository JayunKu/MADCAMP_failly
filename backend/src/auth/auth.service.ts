import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login/login';
import { SignupDto } from './dto/signup/signup';

@Injectable()
export class AuthService {
  createUser(signupDto: SignupDto) {
    // Implementation needed
    return 'This action adds a new user';
  }

  login(loginDto: LoginDto) {
    // Implementation needed
    return 'This action logs in a user';
  }
}
