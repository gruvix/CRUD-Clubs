import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import { getTeamsList } from 'src/components/teamStorage';

@Controller('user')
export class UserController {
  @Get('status')
  getTeamsList(@Req() req: any, @Res() res: Response, @Session() session: any) {
    const { username } = session;
    //Implement username retrieval, return username
    return true;
  }
}
