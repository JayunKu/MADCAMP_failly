import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup/signup';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login/login';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(signupDto: SignupDto): Promise<{ message: string }> {
    const { email, password, nickname } = signupDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('email already in use');
    }

    await this.prisma.user.create({
      data: {
        email,
        password,
        nickname,
      },
    });

    return { message: 'success' };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; user_id: string }> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('invalid email or password');
    }

    return {
      message: 'success',
      user_id: user.id,
    };
  }
}
