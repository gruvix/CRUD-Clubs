import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import Team from "./team.entity";

@Entity()
export default class DefaultTeam {

    @PrimaryColumn()
    id: number;

    @OneToMany(() => Team, (team) => team.defaultTeam)
    teams: Team[];
}