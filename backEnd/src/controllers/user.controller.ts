import { Controller, Get, Req, Res, Session, Post, Body, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
  @Get()
  async getUserStatus(@Req() req: Request & { session: any }) {
    const username = await this.userService.getUsername(req);
    console.log(`User ${username} is retrieving user status`);
    if( !username ) {
       return { statusCode: 401, message: 'Unauthorized' };
    }
    return username;
  }
  }
}
