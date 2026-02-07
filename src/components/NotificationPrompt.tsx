import { motion, AnimatePresence } from "framer-motion";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState } from "react";

export function NotificationPrompt() {
    const { isSupported, isSubscribed, isLoading, subscribe } = usePushNotifications();
    const [isVisible, setIsVisible] = useState(true);

    if (!isSupported || isLoading || isSubscribed || !isVisible) {
        return null;
    }

    const handleEnable = async () => {
        const success = await subscribe();
        if (success) {
            setIsVisible(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-lg right-lg p-0 z-50 max-w-[350px] font-mono text-sm max-sm:bottom-md max-sm:right-md max-sm:left-md"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <div className="bg-bg-tertiary border border-accent-secondary rounded-sm shadow-lg overflow-hidden">
                    <div className="bg-accent-secondary/10 px-sm py-1 border-b border-accent-secondary/20 flex justify-between items-center">
                        <span className="text-accent-secondary text-xs font-bold uppercase tracking-wider">
                            SYSTEM_ALERT
                        </span>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-text-muted hover:text-white transition-colors"
                        >
                            ×
                        </button>
                    </div>

                    <div className="p-md">
                        <div className="flex gap-md">
                            <div className="text-2xl text-accent-secondary">⚠️</div>
                            <div>
                                <h3 className="font-bold text-text-primary mb-xs">Streak Risk Detected</h3>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Enable notifications to prevent loss of streak data.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-sm mt-md justify-end">
                            <button
                                className="px-3 py-1 text-xs text-text-secondary hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-sm"
                                onClick={() => setIsVisible(false)}
                            >
                                [ DISMISS ]
                            </button>
                            <button
                                className="px-3 py-1 text-xs bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/50 hover:bg-accent-secondary/20 transition-all rounded-sm font-bold shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                                onClick={handleEnable}
                            >
                                [ ENABLE_PROTECTION ]
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
