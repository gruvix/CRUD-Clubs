
import { Injectable } from '@nestjs/common';
import { validateUsername } from 'src/components/auth';
import { createUser } from 'src/components/user';
import { getUserTeamsListJSONPath } from 'src/components/userPath';
import { validateFile } from 'src/components/utils';

function userExists(username: string): boolean | Error {
  if (!validateFile(getUserTeamsListJSONPath(username))) {
    return false
  }
  return true;
}

@Injectable()
export class UserService {

  async getUsername(req: Request & { session: any }): Promise<string> {
    return req.session.username;
  }

  async handleUserLogin(username: string) {
    const error = validateUsername(username);
    if (error) {
      throw error;
    }
    const exists = userExists(username);
    if (!exists) {
      try {
        console.log('user not found, creating new user');
        createUser(username);
        return true;
      } catch (error) {
        throw error;
      }
    }
    return true;
  }
}
