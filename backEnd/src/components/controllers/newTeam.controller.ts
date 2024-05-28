import {
  Controller,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@comp/guards/auth.guard';
import TeamService from '@comp/services/team.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from '@comp/storage/multerConfig';
import { Response } from 'express';
import { UserId } from '@comp/decorators/userId.decorator';

@UseGuards(AuthGuard)
@Controller('user/team')
export default class NewTeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async addTeam(
    @UserId() userId: number,
    @Body() body: { teamData: string },
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const parsedTeamData = JSON.parse(body.teamData);
    console.log(
      `User ${userId} is adding the new team "${parsedTeamData.name}"`,
    );
    try {
      const newTeamId = await this.teamService.addTeam(
        userId,
        parsedTeamData,
        image.filename,
      );
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
