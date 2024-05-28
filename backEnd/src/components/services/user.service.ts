import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUsernameValid } from '@comp/validators/userValidation';
import { Repository } from 'typeorm';
import UserNotFoundError from '@comp/errors/UserNotFoundError';
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import User from '@comp/entities/user.entity';
import TeamsService from './teams.service';
import { createFolder } from '@comp/storage/dataStorage';
import { getUserRootPath } from '@comp/storage/userPath';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(TeamsService) private readonly teamsService: TeamsService,
  ) {}

  isLoggedIn(req: CustomRequest): boolean {
    const userId = req.session.userId;
    return !!userId;
  }

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

    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let savedUser = await transactionalEntityManager.save(newUser);

        const baseTeams = await this.teamsService.getDefaultTeams();
        await this.teamsService.copyTeamsToUser(savedUser, baseTeams);
        await transactionalEntityManager.save(savedUser);
      },
    );
    await createFolder(getUserRootPath(username));
  }

  async handleUserLogin(username: string): Promise<boolean> {
    if (!isUsernameValid(username)) return false;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      try {
        console.log('user not found, creating new user');
        await this.createNewUser(username);
        return true;
      } catch (error) {
        throw error;
      }
    }
    return true;
  }
}
