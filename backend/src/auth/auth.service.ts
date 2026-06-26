import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.admin.findUnique({
      where: { username: loginDto.username }
    })

    if (!user) { throw new UnauthorizedException() }

    const isValid = await bcrypt.compare(loginDto.password, user.password)

    if (!isValid) { throw new UnauthorizedException() }

    const payload = {
      sub: user.id
    }

    const accessToken = await this.jwtService.signAsync(payload)

    return { accessToken, id: user.id, username: user.username, message: "Login uccessfully" };
  }


  async getMe(user: { id: number, username: string }) {
    return user
  }
}
