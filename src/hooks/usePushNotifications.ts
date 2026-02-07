import { useState, useEffect } from "react";
import { savePushSubscription, removePushSubscription, getVapidKey } from "@/actions/notifications";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function usePushNotifications() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if service worker and push manager are supported
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            registerServiceWorker();
        } else {
            setIsLoading(false);
        }
    }, []);

    const registerServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error("Service Worker registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribe = async () => {
        setIsLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const vapidPublicKey = await getVapidKey();

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // Send subscription to server
            const result = await savePushSubscription(JSON.parse(JSON.stringify(subscription)));

            if (result.success) {
                setIsSubscribed(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to subscribe:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        setIsLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();
                await removePushSubscription();
                setIsSubscribed(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to unsubscribe:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isSupported,
        isSubscribed,
        isLoading,
        subscribe,
        unsubscribe,
    };
}
