import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';

export const Username = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const username = request.session.username;
    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }
    return username;
  },
);
