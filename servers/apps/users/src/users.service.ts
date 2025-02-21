import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendToken } from '@app/utils';
import { BcryptGenerater } from '@app/utils';
import { EmailService } from '@app/email';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // find all users
  async findAllUser() {
    const users = await this.prisma.user.findMany({
      include: {
        avatar: true,
      },
    });
    return users;
  }
}
