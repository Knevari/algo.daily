"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeetCodeConnectProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername?: string | null;
}

export function LeetCodeConnectModal({ isOpen, onClose, currentUsername }: LeetCodeConnectProps) {
    const [username, setUsername] = useState(currentUsername ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/leetcode/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim() }),
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    window.location.reload(); // Refresh to update session
                }, 1500);
            } else {
                setError(result.message);
            }
        } catch {
            setError("Connection failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[420px] p-xl z-50 glass-card"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        <div className="flex justify-between items-center mb-lg">
                            <h2 className="text-xl font-bold">🔗 Connect LeetCode</h2>
                            <button className="bg-transparent border-none text-2xl text-text-muted cursor-pointer transition-colors hover:text-text-primary" onClick={onClose}>×</button>
                        </div>

                        <p className="text-text-secondary text-sm mb-lg leading-relaxed">
                            Enter your LeetCode username to verify your problem completions automatically.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                            <div className="flex items-center bg-bg-tertiary border border-border rounded-lg overflow-hidden">
                                <span className="px-md py-sm text-text-muted text-sm bg-black/20 border-r border-border">leetcode.com/u/</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    className="flex-1 p-sm bg-transparent border-none text-text-primary text-base outline-none placeholder:text-text-muted disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isLoading || success}
                                    autoFocus
                                />
                            </div>

                            {error && <p className="text-error text-sm">{error}</p>}
                            {success && <p className="text-success text-sm">✅ Connected successfully!</p>}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading || !username.trim() || success}
                            >
                                {isLoading ? "Verifying..." : success ? "Connected!" : "Connect Account"}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
