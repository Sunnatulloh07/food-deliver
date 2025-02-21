import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'servers/email-templates'));
  app.setViewEngine('ejs');

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend manzillari
    credentials: true, // Cookielarni ruxsat berish
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });
  app.use(cookieParser());
  app.use(json());
  const port = process.env.port || 4003;
  await app.listen(port, () => {
    console.log(`Auth server is running on port ${port}`);
  });
}
bootstrap();

