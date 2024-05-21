import PlayerDTO from "./playerDTO";

export default interface TeamDTO {
    name: string;
    area: string;
    address: string;
    phone: string;
    website: string;
    email: string;
    venue: string;
    crestUrl: string;
    hasCustomCrest: boolean;
    squad?: PlayerDTO[];
    hasDefault: boolean;
}