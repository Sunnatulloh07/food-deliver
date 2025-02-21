import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'servers/email-templates'));
  app.setViewEngine('ejs');

  app.use(json());
  await app.listen(process.env.USERS_PORT ?? 4001, () => {
    console.log(
      'Restaurat server running for http://localhost:' +
        process.env.USERS_PORT || 4001,
    );
  });
}
bootstrap();
