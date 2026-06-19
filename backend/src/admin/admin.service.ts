import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async create(createAdminDto: CreateAdminDto) {
    const hashPassword = await bcrypt.hash(createAdminDto.password, 10)

    return await this.prisma.admin.create({
      data: {
        ...createAdminDto,
        password: hashPassword
      }
    });
  }
}
