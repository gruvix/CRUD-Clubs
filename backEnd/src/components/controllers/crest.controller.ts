import {
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CustomRequest from 'src/components/interfaces/CustomRequest.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/components/guards/auth.guard';
import CrestService from '../services/crest.service';
import { Response } from 'express';
import multerOptions from '../storage/multerConfig';

@UseGuards(AuthGuard)
@Controller('user/customCrest')
export default class CrestController {
  constructor(private readonly crestService: CrestService) {}

  @Get(':teamId/:filename')
  async getCrest(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Res() res: Response,
  ) {
    const { username } = req.session;
    const { teamId, filename } = params;
    console.log(`User ${username} is requesting crest for team ${teamId}`);
    const file = await this.crestService.getCrest(username, filename);
    res.send(file);
  }

  @Put(':teamId')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateCrest(
    @Req() req: CustomRequest,
    @Param() params: any,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { username } = req.session;
    const { teamId } = params;
    const { filename } = image;
    console.log(`User ${username} is updating crest for team ${teamId}`);
    try {
      const newCrestUrl = await this.crestService.updateCrest(
        username,
        teamId,
        filename,
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
