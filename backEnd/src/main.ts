import { NestFactory } from '@nestjs/core';
import { AppModule } from './components/modules/app.module';

const CLIENT_BASE_URL = 'http://localhost:8080';
const corsOptions = {
  origin: CLIENT_BASE_URL,
  credentials: true,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
