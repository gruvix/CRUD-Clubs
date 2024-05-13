export default interface TeamData {
    name: string;
    area: string;
    address: string;
    phone: string | number;
    website: string;
    email: string;
    venue: string;
    readonly hasDefault: boolean;
}