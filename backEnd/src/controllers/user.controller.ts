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
import CustomRequest from 'src/components/models/CustomRequest.interface';
import UserService from 'src/services/user.service';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUserStatus(@Req() req: CustomRequest) {
    if (!(await this.userService.isLoggedIn(req))) {
      throw new HttpException('Not logged in', HttpStatus.UNAUTHORIZED);
    }
    return;
  }
  @Post()
  login(
    @Req() request: CustomRequest,
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
  logout(@Req() request: CustomRequest) {
    console.log(`User ${request.session.username} is logging out`);
    request.session.destroy((error) => {
      if (error) {
        throw new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }
}
