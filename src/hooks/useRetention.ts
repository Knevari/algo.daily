import { useEffect } from "react";

/**
 * Custom hook to alternate the browser tab title and send browser notifications
 * when the user is inactive and hasn't completed their daily streak goal.
 */
export function useRetention(isDailyGoalComplete: boolean, status: string) {
    // Tab Title Hijacking
    useEffect(() => {
        if (isDailyGoalComplete || status !== "authenticated") return;

        let interval: any;
        const originalTitle = "AlgoDaily - Dashboard";

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                interval = setInterval(() => {
                    document.title = document.title === originalTitle
                        ? "⚠️ SAVE YOUR STREAK!"
                        : originalTitle;
                }, 1500);
            } else {
                if (interval) clearInterval(interval);
                document.title = originalTitle;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (interval) clearInterval(interval);
            document.title = originalTitle;
        };
    }, [isDailyGoalComplete, status]);

    // Web Push/Local Notifications
    useEffect(() => {
        if (isDailyGoalComplete || status !== "authenticated") return;

        // Check if notifications are supported
        if (!("Notification" in window)) return;

        // Register Service Worker for true background support
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(console.error);
        }

        // Function to show the streak reminder
        const showReminder = () => {
            if (Notification.permission === "granted" && !isDailyGoalComplete) {
                // Use service worker to show notification (more reliable)
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification("AlgoDaily Streak Alert! 🦉", {
                        body: "The clock is ticking! Complete your daily problem to save your streak.",
                        icon: "/favicon.ico",
                        badge: "/favicon.ico",
                        tag: "streak-reminder",
                        renotify: true
                    });
                });
            }
        };

        // Auto-request permission after 5 seconds of dashboard activity
        const permissionTimer = setTimeout(() => {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
        }, 5000);

        // Initial reminder to show it's working (or after some time)
        const reminderTimer = setTimeout(showReminder, 1000 * 60 * 5); // 5 minute reminder

        return () => {
            clearTimeout(permissionTimer);
            clearTimeout(reminderTimer);
        };
    }, [isDailyGoalComplete, status]);
}
