import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import Team from './team.entity';

@Entity()
export default class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team, team => team.squad)
    team: Team

    @Column()
    name: string;

    @Column()
    position: string;

    @Column()
    nationality: string;
}