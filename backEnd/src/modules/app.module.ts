import { Module } from '@nestjs/common';
import { TeamsController } from 'src/controllers/teams.controller';
import { SessionModule } from 'nestjs-session';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';

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
  controllers: [TeamsController, UserController],
  providers: [UserService],
})
export class AppModule {}
