interface TeamJSON {
    id: number;
    name: string;
    area: { name: string };
    phone: string;
    address: string;
    website: string;
    email: string;
    venue: string;
    crestUrl: string;
    squad: PlayerJSON[];
    hasCustomCrest: boolean | null;
    lastUpdated: Date;
  }