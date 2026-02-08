"use server";

import { Registry } from "@/infrastructure/Registry";

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
    const userRepository = Registry.getUserRepository();

    // Use the Port instead of direct DB access
    const users = await userRepository.getLeaderboard(50);

    return users.map((user: any, index: number) => ({
        id: user.id,
        name: user.name ?? `User ${user.id.slice(0, 4)}`,
        image: user.image,
        xp: user.xp,
        streak: user.streak,
        rank: index + 1,
        isCurrentUser: false, // Will be set by client
    }));
}
