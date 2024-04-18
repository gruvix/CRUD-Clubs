import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import UserService from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isLoggedIn = this.userService.isLoggedIn(request);
    return isLoggedIn;
  }
}
