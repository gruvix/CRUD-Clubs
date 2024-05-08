import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "../entities/user.entity";
import Team from "../models/Team";
import Player from "../models/Player";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: './src/userData/userData.db',
            entities: [User, Team, Player],
            synchronize: process.env.PRODUCTION === 'false' ? true : false,
            logging: true,
          })
    ],
})
export default class DataBaseModule {}
