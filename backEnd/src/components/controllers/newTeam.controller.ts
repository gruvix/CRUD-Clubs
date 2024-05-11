import {
  Controller,
  Req,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Res,
} from '@nestjs/common';
import CustomRequest from 'src/components/interfaces/CustomRequest.interface';
import { AuthGuard } from 'src/components/guards/auth.guard';
import TeamService from 'src/components/services/team.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from '../storage/multerConfig';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('user/team')
export default class NewTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async addTeam(
    @Req() req: CustomRequest,
    @Body() body: { teamData: string },
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { username } = req.session;
    const parsedTeamData = JSON.parse(body.teamData);
    console.log(
      `User ${username} is adding the new team "${parsedTeamData.name}"`,
    );
    try {
      const newTeamId = await this.teamService.addTeam(
        username,
        parsedTeamData,
        image.filename,
      )
      res.status(201).send(newTeamId.toString());
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).send(error.message);
      } else {
        console.log(error.message);
        return res.status(500).send(error.message);
      }
    }
  }
}
