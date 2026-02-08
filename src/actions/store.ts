"use server";

import { Registry } from "@/infrastructure/Registry";
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

    const userRepository = Registry.getUserRepository();
    const user = await userRepository.findById(session.user.id);

    if (!user) {
        return { success: false, message: "User not found" };
    }

    try {
        // Delegate to Domain Logic
        user.purchaseStreakFreeze(FREEZE_COST_XP, MAX_FREEZES);

        // Persist
        await userRepository.save(user);

        revalidatePath("/"); // Refresh UI
        return { success: true, message: "Streak Freeze equipped! ❄️" };
    } catch (error: any) {
        return { success: false, message: error.message || "Purchase failed" };
    }
}
