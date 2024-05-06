import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import User from './user.entity';
import Player from './player.entity';

@Entity()
export default class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.teams)
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  venue: string;

  @Column()
  crestUrl: string;

  @OneToMany(() => Player, (player) => player.team)
  squad: Player[];

  @Column()
  hasCustomCrest: boolean;

  @Column({ default: false })
  hasDefault: boolean;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @CreateDateColumn({ type: 'date' })
  updatedAt: Date;
}
