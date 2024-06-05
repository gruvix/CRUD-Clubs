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
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import UserService from '@comp/services/user.service';
import { UserId } from '@comp/decorators/userId.decorator';
import UserNotFoundError from '@comp/errors/UserNotFoundError';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUserStatus(@UserId() userId: number) {
    console.log(`User ${userId} is requesting user status`);
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
        request.session.userId = await this.userService.getUserId(
          data.username,
        );
        console.log(
          `User ${data.username} ID ${request.session.userId} is logged in`,
        );
        return;
      } else {
        console.log('Failed to login user');
        throw new HttpException('Failed to login user', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof UserNotFoundError)
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Failed to login user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
  @Delete()
  async logout(@Req() request: CustomRequest) {
    console.log(`User ${request.session.userId} is logging out`);
    await request.session.destroy((error) => {
      if (error) {
        throw new HttpException(
          'Failed to logout',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return;
  }
}
