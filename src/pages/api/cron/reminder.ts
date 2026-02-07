import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { sendPushNotification, NotificationTemplates, type PushSubscription } from "@/lib/push";
import { Prisma } from "@prisma/client";

/**
 * Cron job endpoint for sending daily reminders
 * Can be called by Vercel Cron or external scheduler
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Verify authorization (simple bearer token check)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Check if it's running in development
        if (process.env.NODE_ENV !== "development") {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }

    try {
        // 1. Get users with subscriptions who haven't completed daily duo today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const usersToRemind = await db.user.findMany({
            where: {
                pushSubscription: {
                    not: null, // SQLite string check
                },
                dailyProgress: {
                    none: {
                        date: today,
                        isCompleted: true,
                    },
                },
            },
            select: {
                id: true,
                streak: true,
                pushSubscription: true,
            },
            take: 50, // Batch size
        });

        console.log(`Sending reminders to ${usersToRemind.length} users...`);

        const results = await Promise.allSettled(
            usersToRemind.map(async (user) => {
                if (!user.pushSubscription) return;

                let subscription: PushSubscription;
                try {
                    subscription = JSON.parse(user.pushSubscription);
                } catch (e) {
                    console.error("Invalid subscription JSON", e);
                    return;
                }

                const payload = NotificationTemplates.dailyReminder(user.streak);

                const success = await sendPushNotification(subscription, payload);

                if (!success) {
                    // If sending failed (e.g. expired/unsubscribed), remove subscription
                    await db.user.update({
                        where: { id: user.id },
                        data: { pushSubscription: null },
                    });
                }
                return success;
            })
        );

        const sentCount = results.filter(r => r.status === "fulfilled" && r.value).length;

        return res.status(200).json({
            success: true,
            processed: usersToRemind.length,
            sent: sentCount
        });

    } catch (error) {
        console.error("Cron job failed:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
