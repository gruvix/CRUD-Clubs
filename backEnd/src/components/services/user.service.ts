import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUsernameValid } from '@comp/validators/userValidation';
import { Repository } from 'typeorm';
import UserNotFoundError from '@comp/errors/UserNotFoundError';
import User from '@comp/entities/user.entity';
import TeamsService from './teams.service';
import { createFolder } from '@comp/storage/dataStorage';
import { getUserRootPath } from '@comp/storage/userPath';
import InvalidUsernameError from '@comp/errors/InvalidUsernameError';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(TeamsService) private readonly teamsService: TeamsService,
  ) {}

  async getUserId(username: string): Promise<number> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new UserNotFoundError(`User ${username} not found`);
    }
    return user.id;
  }

  private async createNewUser(
    username: string,
    password: string = 'default',
  ): Promise<void> {
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.teams = [];

    const userId = await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let savedUser = await transactionalEntityManager.save(newUser);

        const baseTeams = await this.teamsService.getDefaultTeams();
        await this.teamsService.copyTeamsToUser(savedUser, baseTeams);
        await transactionalEntityManager.save(savedUser);
        return savedUser.id;
      },
    );
    await createFolder(getUserRootPath(userId));
  }

  async findOrCreateUser(username: string): Promise<void> {
    if (!isUsernameValid(username)) throw new InvalidUsernameError();
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      try {
        console.log('user not found, creating new user');
        await this.createNewUser(username);
      } catch (error) {
        throw error;
      }
    }
  }
}
