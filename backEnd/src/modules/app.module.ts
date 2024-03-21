import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TeamsController } from 'src/controllers/teams.controller';
import { SessionModule } from 'nestjs-session';
import { UserController } from 'src/controllers/user.controller';

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
  controllers: [AppController, TeamsController, UserController],
  providers: [AppService],
})
export class AppModule {}
