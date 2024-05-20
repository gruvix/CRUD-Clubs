import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Username = createParamDecorator((data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.session.username;
})