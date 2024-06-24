import Player from "@comp/entities/player.entity";

export default interface TeamData {
    id: number
    name: string;
    area: string;
    address: string;
    phone: string;
    website: string;
    email: string;
    venue: string;
    crestUrl: string;
    hasCustomCrest: boolean;
    squad?: Player[];
    readonly defaultTeam: number;
}