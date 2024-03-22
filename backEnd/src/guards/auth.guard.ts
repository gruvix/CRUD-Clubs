import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isLoggedIn = await this.userService.isLoggedIn(request);
    return isLoggedIn;
  }
}
