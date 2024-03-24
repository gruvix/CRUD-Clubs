
import { Injectable } from '@nestjs/common';
import { validateUsername } from 'src/components/userValidation';
import { createUser } from 'src/components/Adapters/userStorage.adapter';
import { getUserTeamsListJSONPath } from 'src/components/storage/userPath';
import { validateFile } from 'src/components/storage/dataStorage';
import CustomRequest from '../models/CustomRequest.interface';

function userExists(username: string): boolean | Error {
  if (!validateFile(getUserTeamsListJSONPath(username))) {
    return false
  }
  return true;
}
function getUsername(req: CustomRequest): string {
  return req.session.username;
}

@Injectable()
export default class UserService {

  isLoggedIn(req: CustomRequest): boolean {
    const username = getUsername(req);
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