import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import session from 'express-session';
import createFileStore from "session-file-store";
import path from "path";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const fileStoreOptions = {
    path: path.join(__dirname, "src", "sessions"),
    ttl: 60 * 60 * 24,
    logFn: () => {},
    reapInterval: 60 * 60,
  };
  const FileStore = createFileStore(session);


  app.use(
    session({
      store: new FileStore(fileStoreOptions),
      secret: 'keyboard-cat',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60 * 60 * 24, sameSite: 'none', secure: false },
    }),
  );

  await app.listen(3000);
}
bootstrap();
