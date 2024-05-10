import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import Team from './team.entity';

@Entity()
export default class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.id)
  team: Team;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  nationality: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
