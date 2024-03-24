import {
  Controller,
  Req,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import TeamData from 'src/components/models/TeamData.interface';
import { AuthGuard } from 'src/components/guards/auth.guard';
import TeamService from 'src/components/services/team.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from '../storage/multerConfig';

@UseGuards(AuthGuard)
@Controller('user/team')
export default class NewTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  addTeam(
    @Req() req: CustomRequest,
    @Body() teamData: TeamData,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is adding new team`);
    return this.teamService.addTeam(username, teamData, image.filename);
  }
}
