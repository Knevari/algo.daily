"use server";

import { db } from "@/lib/db";

export interface LeaderboardEntry {
    id: string;
    name: string;
    image: string | null;
    xp: number;
    streak: number;
    rank: number;
    isCurrentUser: boolean;
}

/**
 * Get top 50 users by XP for the current week (simulated by total XP for MVP)
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await db.user.findMany({
        take: 50,
        orderBy: { xp: "desc" },
        select: {
            id: true,
            name: true,
            image: true,
            xp: true,
            streak: true,
        },
    });

    return users.map((user, index) => ({
        id: user.id,
        name: user.name ?? `User ${user.id.slice(0, 4)}`,
        image: user.image,
        xp: user.xp,
        streak: user.streak,
        rank: index + 1,
        isCurrentUser: false, // Will be set by client
    }));
}
