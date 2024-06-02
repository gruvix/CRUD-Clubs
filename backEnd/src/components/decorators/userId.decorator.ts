import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const userId = request.session.userId;
    if (!userId) {
      throw new HttpException('Not logged in', HttpStatus.UNAUTHORIZED);
    }
    return Number(userId);
  },
);
