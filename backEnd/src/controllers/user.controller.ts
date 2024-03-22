import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
  @Post()
  login(
    @Req() request: Request & { session: any },
    @Body() data: { username: string },
  ) {
    const success = this.userService.handleUserLogin(data.username);
    if (success) {
      request.session.username = data.username;
      console.log(`User ${data.username} logged in`);
      return;
    } else {
      throw new HttpException('Failed to login user', HttpStatus.BAD_REQUEST);
    }
  }
  @Delete()
  logout(@Req() request: Request & { session: any }) {
    console.log(`User ${request.session.username} logged out`);
    request.session.username = undefined;
  }
}
