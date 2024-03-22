import { Controller, Get, Req, Res, Session, Post, Body, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
  @Get()
  async getUserStatus(@Req() req: Request & { session: any }) {
    if (!(await this.userService.isLoggedIn(req))) {
      throw new HttpException('Not logged in', HttpStatus.UNAUTHORIZED);
    }
    return;
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
