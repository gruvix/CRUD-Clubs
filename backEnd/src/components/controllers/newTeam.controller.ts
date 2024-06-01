import {
  Controller,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@comp/guards/auth.guard';
import TeamService from '@comp/services/team.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from '@comp/storage/multerConfig';
import { UserId } from '@comp/decorators/userId.decorator';
import { UploadedFileName } from '@comp/decorators/uploadedFileName.decorator';

@UseGuards(AuthGuard)
@Controller('user/team')
export default class NewTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async addTeam(
    @UserId() userId: number,
    @Body() body: { teamData: string },
    @UploadedFileName() imageFileName: string,
  ): Promise<number> {
    const parsedTeamData = JSON.parse(body.teamData);
    console.log(
      `User ${userId} is adding the new team "${parsedTeamData.name}"`,
    );
    try {
      const newTeamId = await this.teamService.addTeam(
        userId,
        parsedTeamData,
        imageFileName,
      );
      return newTeamId;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException(
          'Failed to add team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
