import { NestFactory } from '@nestjs/core';
import { RestaurantsModule } from './restaurants.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(RestaurantsModule);
    
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'servers/email-templates'));
  app.setViewEngine('ejs');

  app.enableCors({
    origin: ['*'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(json())
  await app.listen(process.env.RESTAURANT_PORT ?? 4002, () => {
  console.log('Restaurat server running for http://localhost:'+process.env.RESTAURANT_PORT|| 4002 )
  });
}
bootstrap();
