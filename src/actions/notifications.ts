"use server";

import { Registry } from "@/infrastructure/Registry";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { PushSubscription } from "@/lib/push";

/**
 * Save a Web Push subscription for the current user
 */
export async function savePushSubscription(
    subscription: PushSubscription
): Promise<{ success: boolean; message: string }> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        const userRepository = Registry.getUserRepository();
        await userRepository.savePushSubscription(session.user.id, JSON.stringify(subscription));

        return { success: true, message: "Notifications enabled!" };
    } catch (error) {
        console.error("Failed to save push subscription:", error);
        return { success: false, message: "Failed to save subscription" };
    }
}

/**
 * Remove push subscription
 */
export async function removePushSubscription(): Promise<{ success: boolean; message: string }> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        const userRepository = Registry.getUserRepository();
        await userRepository.removePushSubscription(session.user.id);

        return { success: true, message: "Notifications disabled" };
    } catch (error) {
        console.error("Failed to remove push subscription:", error);
        return { success: false, message: "Failed to disable notifications" };
    }
}

/**
 * Get public VAPID key for client-side subscription
 */
export async function getVapidKey(): Promise<string> {
    return process.env.VAPID_PUBLIC_KEY ?? "";
}
