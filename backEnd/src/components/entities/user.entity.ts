import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
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

  @CreateDateColumn({ select: false, type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'date' })
  updatedAt: Date;

  @OneToMany(() => Team, (team) => team.user, { cascade: true })
  teams: Team[];
}
