import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './components/modules/app.module';

const corsOptions = {
  origin: process.env.CLIENT_BASE_URL,
  credentials: true,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
