import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
})