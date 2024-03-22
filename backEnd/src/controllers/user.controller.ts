import { Controller, Get, Req, Res, Session, Post, Body, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
  @Get()
  async getUserStatus(@Req() req: Request & { session: any }) {
    const username = await this.userService.isLoggedIn(req);
    console.log(`User ${username} is retrieving user status`);
    if( !username ) {
       return { statusCode: 401, message: 'Unauthorized' };
    }
    return username;
  }
  @Post('login')
  login(@Req() request: Request & { session: any }, @Res() response: Response, @Body() data: {username: string}) {
    const success = this.userService.handleUserLogin(data.username);
    if ( success ) {
      request.session.username = data.username;
      console.log(`User ${data.username} logged in`);
      response.status(200).send();
      //return;
    } else {
      response.status(400).send('Failed to login user');
      //return { statusCode: 400, message: 'Failed to login user' + success };
    }
  }
}
