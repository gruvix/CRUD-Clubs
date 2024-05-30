import {
  Controller,
  Get,
  HttpException,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@comp/guards/auth.guard';
import CrestService from '@comp/services/crest.service';
import { Response } from 'express';
import multerOptions from '@comp/storage/multerConfig';
import { UserId } from '@comp/decorators/userId.decorator';
import { TeamId } from '@comp/decorators/teamId.decorator';
import { FileName } from '@comp/decorators/fileName.decorator';
import { Username } from '@comp/decorators/username.decorator';
import { TeamGuard } from '@comp/guards/team.guard';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/customCrest')
export default class CrestController {
  constructor(private readonly crestService: CrestService) {}

  @Get(':teamId/:fileName')
  async getCrest(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @FileName() fileName: string,
    @Res() res: Response,
  ) {
    console.log(`User ${userId} is requesting crest for team ${teamId}`);
    const file = await this.crestService.getCrest(userId, fileName);
    res.send(file);
  }

  @Put(':teamId')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateCrest(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    console.log(`User ${userId} is updating crest for team ${teamId}`);
    try {
      const newCrestUrl = await this.crestService.updateCrest(
        userId,
        teamId,
        image.filename,
      );
      res.send(JSON.stringify(newCrestUrl));
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
