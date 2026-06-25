import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // السطر السحري الاحترافي لفتح الاتصال مع واجهات الفرونت إند ومنع خطأ Failed to fetch
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
