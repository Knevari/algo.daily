import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHOP_ITEMS, buyStreakFreeze } from "@/actions/store";
import { useSession } from "next-auth/react";
import { celebrateProblem } from "@/lib/confetti";
import { sounds } from "@/lib/sounds";

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    userXp: number;
    userFreezes: number;
}

export function StoreModal({ isOpen, onClose, userXp, userFreezes }: StoreModalProps) {
    const { update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleBuy = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await buyStreakFreeze();

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                celebrateProblem(); // Minimal confetti
                sounds.playLevelUp(); // Play sound
                await update(); // Update session to reflect new XP/Inventory
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch {
            setMessage({ type: 'error', text: "Transaction failed. Try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const item = SHOP_ITEMS[0]; // Currently only one item

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-1/2 left-1/2 w-[90%] max-w-[480px] p-lg z-50 glass-card border border-border"
                        initial={{ scale: 0.9, opacity: 0, x: "-50%", y: "-40%" }}
                        animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
                        exit={{ scale: 0.9, opacity: 0, x: "-50%", y: "-40%" }}
                    >
                        <div className="flex justify-between items-center mb-lg">
                            <h2 className="text-xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">Power-Up Store</h2>
                            <button className="bg-transparent border-none text-text-muted text-2xl cursor-pointer p-0 leading-none hover:text-white" onClick={onClose}>×</button>
                        </div>

                        <div className="bg-white/5 p-md rounded-md flex justify-between items-center mb-lg">
                            <span className="text-text-secondary text-sm">Your Balance:</span>
                            <span className="text-accent-primary font-bold text-lg">⚡ {userXp} XP</span>
                        </div>

                        <div className="flex flex-col gap-md">
                            <div className="flex items-center gap-md p-md bg-black/20 border border-white/10 rounded-md">
                                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-md">{item.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-white mb-0.5">{item.name}</h3>
                                    <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                                    <div className="text-[0.7rem] text-purple-primary mt-1 font-medium">
                                        Owned: {userFreezes} / {item.maxQuantity}
                                    </div>
                                </div>
                                <button
                                    className={`btn ${userXp >= item.cost ? 'btn-primary' : 'btn-ghost'}`}
                                    disabled={isLoading || userXp < item.cost || (item.maxQuantity ? userFreezes >= item.maxQuantity : false)}
                                    onClick={handleBuy}
                                >
                                    {isLoading ? "..." : `${item.cost} XP`}
                                </button>
                            </div>
                        </div>

                        {message && (
                            <p className={`mt-md text-center text-sm p-sm rounded-sm ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                {message.text}
                            </p>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
