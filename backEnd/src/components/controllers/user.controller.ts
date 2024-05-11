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
import CustomRequest from 'src/components/interfaces/CustomRequest.interface';
import UserService from 'src/components/services/user.service';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUserStatus(@Req() req: CustomRequest) {
    console.log(`User is requesting user status: ${req.session.username}`);
    if (!this.userService.isLoggedIn(req)) {
      throw new HttpException('Not logged in', HttpStatus.UNAUTHORIZED);
    }
    return;
  }
  @Post()
  async login(
    @Req() request: CustomRequest,
    @Body() data: { username: string },
  ) {
    try {
      const success = await this.userService.handleUserLogin(data.username);
      if (success) {
        request.session.username = data.username;
        console.log(`User ${data.username} logged in`);
        return;
      } else {
        console.log('Failed to login user');
        throw new HttpException('Failed to login user', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Failed to login user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
  @Delete()
  logout(@Req() request: CustomRequest) {
    console.log(`User ${request.session.username} is logging out`);
    request.session.destroy((error) => {
      if (error) {
        throw new HttpException(
          'Failed to logout',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}
