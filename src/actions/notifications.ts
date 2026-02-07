"use server";

import { db } from "@/lib/db";
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
        // Save subscription to user profile
        // Note: SQLite stores JSON as string
        await db.user.update({
            where: { id: session.user.id },
            data: {
                pushSubscription: JSON.stringify(subscription),
            },
        });

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
        await db.user.update({
            where: { id: session.user.id },
            data: {
                pushSubscription: null,
            },
        });

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
