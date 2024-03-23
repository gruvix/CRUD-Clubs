
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
function getUsername(req: Request & { session: any }): Promise<string> {
  return req.session.username;
}

@Injectable()
export default class UserService {

  async isLoggedIn(req: Request & { session: any }): Promise<boolean> {
    const username = await getUsername(req);
    return !!username;
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
