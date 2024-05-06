import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';

@Entity()
export default class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user: string;

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

  @Column()
  hasCustomCrest: boolean;

  @Column({ default: false })
  hasDefault: boolean;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @CreateDateColumn({ type: 'date' })
  updatedAt: Date;
}
