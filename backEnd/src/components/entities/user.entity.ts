import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  Column,
} from 'typeorm';
import Team from './team.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @CreateDateColumn({ type: 'date' })
  updatedAt: Date;

  @OneToMany(() => Team, (team) => team.user, { cascade: true })
  teams: Team[];
}
