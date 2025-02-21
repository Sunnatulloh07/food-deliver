import { BcryptGenerater, SendToken } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from '@app/email';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class RestaurantsService {
  constructor() {}
}
