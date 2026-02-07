import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            streak: number;
            xp: number;
            gems: number;
            leetcodeUsername?: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        streak?: number;
        xp?: number;
        gems?: number;
        leetcodeUsername?: string | null;
    }
}
