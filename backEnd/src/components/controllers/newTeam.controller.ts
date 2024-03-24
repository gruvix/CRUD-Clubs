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
    @Body() body: {teamData: string},
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { username } = req.session;
    const parsedTeamData = JSON.parse(body.teamData);
    console.log(`User ${username} is adding the new team "${parsedTeamData.name}"`);
    return this.teamService.addTeam(username, parsedTeamData, image.filename);
  }
}
