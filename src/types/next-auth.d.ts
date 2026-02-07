import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            image?: string | null;
            xp: number;
            streak: number;
            gems: number;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        xp: number;
        streak: number;
        gems: number;
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser {
        id: string;
        username: string;
        xp: number;
        streak: number;
        gems: number;
    }
}
