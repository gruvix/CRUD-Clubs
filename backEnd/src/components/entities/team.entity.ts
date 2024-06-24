import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import User from './user.entity';
import Player from './player.entity';
import DefaultTeam from './defaultTeam.entity';

@Entity()
export default class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, (user) => user.id)
  user: number;

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

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  squad?: Player[];

  @Column()
  hasCustomCrest: boolean;

  @Column({ nullable: true, select: false })
  crestFileName: string;

  @ManyToOne(() => DefaultTeam, (defaultTeam) => defaultTeam.id || null)
  defaultTeam: number;

  @CreateDateColumn({ select: false, type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'date' })
  updatedAt: Date;
}
