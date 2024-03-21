import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TeamsController } from 'src/controllers/teams.controller';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        secret: 'keyboard-cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 24, sameSite: 'none', secure: false },
      },
    }),
  ],
  controllers: [AppController, TeamsController],
  providers: [AppService],
})
export class AppModule {}
