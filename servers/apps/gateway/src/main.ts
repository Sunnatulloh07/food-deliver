import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend manzillari
    credentials: true, // Cookielarni ruxsat berish
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });

  app.use(cookieParser()); // Ensure cookie-parser is used
  app.use(json()); // Ensure body-parser for JSON is used
  const port = process.env.PORT ?? 4000
  await app.listen(port , () => console.log("Gateway Server runnet on port: " + port));
}

bootstrap();
