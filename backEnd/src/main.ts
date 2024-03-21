import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { CLIENT_BASE_URL } from "./components/routing/paths";

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
