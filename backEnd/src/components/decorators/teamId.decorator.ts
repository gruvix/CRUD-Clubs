import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';

export const TeamId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const teamId = request.params.teamId;

    if (!teamId) {
      throw new HttpException('Team ID is required', HttpStatus.BAD_REQUEST);
    }
    return Number(teamId);
  },
);
