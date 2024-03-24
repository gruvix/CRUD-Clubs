import { Controller, Get, Param, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
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
  addTeam(@Req() req: CustomRequest, @Param() params: any, @Res() res: Response) {
    const { username } = req.session;
    const { teamId, filename } = params;
    console.log(`User ${username} is requesting crest for team ${teamId}`);
    const file = this.crestService.getCrest(username, filename);
    res.send(file);
  }

  @Put(':teamId')
  @UseInterceptors(FileInterceptor('image', multerOptions))
    updateCrest(@Req() req: CustomRequest, @Param() params: any, @UploadedFile() image: Express.Multer.File) {
    const { username } = req.session;
    const { teamId } = params;
    const { filename } = image;
    console.log(`User ${username} is updating crest for team ${teamId}`);
    const newCrestUrl = this.crestService.updateCrest(username, teamId, filename);
    return JSON.stringify(newCrestUrl);
  }
}
