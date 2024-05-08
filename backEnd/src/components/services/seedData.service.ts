import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';
@Injectable()
export default class SeedDataService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}
  async onModuleInit() {
    const valueExists = await this.userRepository
      .findOneBy({ username: 'default' })
      .then();
    if (!valueExists) {
      await this.seedBaseTeams();
    }
  }

  private async seedBaseTeams(): Promise<void> {
  }
