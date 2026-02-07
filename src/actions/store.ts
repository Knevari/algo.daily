"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { revalidatePath } from "next/cache";

const FREEZE_COST_XP = 500;
const MAX_FREEZES = 2;

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    currency: "XP" | "GEMS";
    icon: string;
    maxQuantity?: number;
}

export const SHOP_ITEMS: ShopItem[] = [
    {
        id: "streak-freeze",
        name: "Streak Freeze",
        description: "Miss a day without losing your streak. Auto-equips.",
        cost: FREEZE_COST_XP,
        currency: "XP",
        icon: "❄️",
        maxQuantity: MAX_FREEZES,
    },
];

export async function buyStreakFreeze(): Promise<{ success: boolean; message: string }> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, message: "Not authenticated" };
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, xp: true, streakFreezes: true },
    });

    if (!user) {
        return { success: false, message: "User not found" };
    }

    if (user.streakFreezes >= MAX_FREEZES) {
        return { success: false, message: `You can only hold ${MAX_FREEZES} freezes at a time!` };
    }

    if (user.xp < FREEZE_COST_XP) {
        return { success: false, message: `Not enough XP! Need ${FREEZE_COST_XP} XP.` };
    }

    // Transaction to ensure atomic update
    await db.$transaction([
        db.user.update({
            where: { id: user.id },
            data: {
                xp: { decrement: FREEZE_COST_XP },
                streakFreezes: { increment: 1 },
            },
        }),
    ]);

    revalidatePath("/"); // Refresh UI
    return { success: true, message: "Streak Freeze equipped! ❄️" };
}
