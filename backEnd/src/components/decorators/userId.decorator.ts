import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    let userId: number;
    try {
      userId = request.session.userId;
    } catch (error) {
      console.log(error);
      throw new HttpException('Request malformed', HttpStatus.BAD_REQUEST);
    }
    if (!userId) {
      throw new HttpException('Not logged in', HttpStatus.UNAUTHORIZED);
    }
    return Number(userId);
  },
);
