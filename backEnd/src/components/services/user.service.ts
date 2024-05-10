import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUsernameValid } from 'src/components/userValidation';
import { Repository } from 'typeorm';
import CustomRequest from '../models/CustomRequest.interface';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  isLoggedIn(req: CustomRequest): boolean {
    const username = req.session.username;
    return !!username;
  }
  private copyPlayersToTeam(
    team: Team,
    players: Player[],
  ): void {
    for (const player of players) {
      player.team = team;
      delete player.id;
      team.squad.push(player);
    }
  }

  private async copyTeamsToUser(user: User, teams: Team[]): Promise<void> {
    for (const team of teams) {
      team.user = user.id;
      const players: Player[] = (
        await this.teamRepository.manager.findOne(Team, {
          where: { user: user.id },
          relations: ['squad'],
        })
      ).squad;
      delete team.id;
      team.squad = [];
      this.copyPlayersToTeam(team, players);
      user.teams.push(team);
    }
  }

  private async createNewUser(
    username: string,
    password: string = 'default',
  ): Promise<void> {
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.teams = [];

    this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let savedUser = await transactionalEntityManager.save(newUser);

        const baseTeams = (
          await transactionalEntityManager.findOne(User, {
            where: { username: 'default' },
            relations: ['teams'],
          })
        ).teams;
        await this.copyTeamsToUser(savedUser, baseTeams);
        await transactionalEntityManager.save(savedUser);
      },
    );
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
