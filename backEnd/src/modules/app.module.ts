import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TeamsController } from 'src/controllers/teams.controller';

@Module({
  imports: [],
  controllers: [AppController, TeamsController],
  providers: [AppService],
})
export class AppModule {}
