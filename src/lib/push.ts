/**
 * Web Push Notification Service
 * Uses VAPID keys for secure push messaging
 */
import webpush from "web-push";

// Set VAPID details from environment variables
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        `mailto:${process.env.VAPID_EMAIL ?? "admin@algodaily.app"}`,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: Record<string, unknown>;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
}

/**
 * Send a push notification to a subscriber
 */
export async function sendPushNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
): Promise<boolean> {
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify(payload)
        );
        return true;
    } catch (error) {
        console.error("Failed to send push notification:", error);
        return false;
    }
}

/**
 * Pre-defined notification templates
 */
export const NotificationTemplates = {
    dailyReminder: (streak: number): NotificationPayload => ({
        title: "🦉 Time for your Daily Duo!",
        body: `Keep your ${streak}-day streak alive! 2 problems await.`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        tag: "daily-reminder",
        actions: [
            { action: "open", title: "Start Solving" },
            { action: "snooze", title: "Remind Later" },
        ],
    }),

    streakDanger: (streak: number): NotificationPayload => ({
        title: "⚠️ Streak in Danger!",
        body: `You haven't completed today's problems. Your ${streak}-day streak expires at midnight!`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        tag: "streak-danger",
        actions: [
            { action: "open", title: "Save My Streak" },
        ],
    }),

    streakLost: (): NotificationPayload => ({
        title: "💔 Streak Lost",
        body: "Your streak has reset. Start a new one today!",
        icon: "/icons/icon-192x192.png",
        tag: "streak-lost",
    }),

    dailyComplete: (streak: number, xp: number): NotificationPayload => ({
        title: "🎉 Daily Duo Complete!",
        body: `Amazing! ${streak} day streak 🔥 +${xp} XP earned.`,
        icon: "/icons/icon-192x192.png",
        tag: "daily-complete",
    }),

    leaguePromotion: (newLeague: string): NotificationPayload => ({
        title: `🏆 Promoted to ${newLeague}!`,
        body: "You finished in the top 10 this week. Keep climbing!",
        icon: "/icons/icon-192x192.png",
        tag: "league-promotion",
    }),
};

/**
 * Get the public VAPID key for client-side subscription
 */
export function getVapidPublicKey(): string {
    return process.env.VAPID_PUBLIC_KEY ?? "";
}
