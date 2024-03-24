import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import { AuthGuard } from 'src/components/guards/auth.guard';
import CrestService from '../services/crest.service';
import { Response } from 'express';

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
}
