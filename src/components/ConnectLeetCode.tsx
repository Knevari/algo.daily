import { useState } from "react";
import { motion } from "framer-motion";

interface ConnectLeetCodeProps {
    currentUsername?: string | null;
    onConnect: (username: string) => Promise<{ success: boolean; message: string }>;
}

export function ConnectLeetCode({ currentUsername, onConnect }: ConnectLeetCodeProps) {
    const [username, setUsername] = useState(currentUsername ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await onConnect(username.trim());
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
            }
        } catch {
            setError("Failed to connect. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success || currentUsername) {
        return (
            <motion.div
                className="glass-card p-lg flex items-center gap-md border-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <span className="text-2xl">✅</span>
                <div className="flex flex-col">
                    <span className="text-xs text-success font-semibold uppercase tracking-wider">LeetCode Connected</span>
                    <span className="text-base font-semibold text-text-primary">@{currentUsername ?? username}</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="glass-card p-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start gap-md mb-lg">
                <span className="text-2xl">🔗</span>
                <div>
                    <h3 className="text-base font-semibold mb-xs">Connect LeetCode</h3>
                    <p className="text-sm text-text-muted">We&apos;ll auto-verify your submissions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-md">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your LeetCode username"
                    className="flex-1 p-md bg-bg-tertiary border border-border rounded-md text-text-primary text-sm transition-all duration-150 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-glow disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-text-muted"
                    disabled={isLoading}
                />
                <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !username.trim()}
                    whileTap={{ scale: 0.95 }}
                >
                    {isLoading ? "Connecting..." : "Connect"}
                </motion.button>
            </form>

            {error && (
                <motion.p
                    className="mt-md p-sm px-md bg-error/10 rounded-sm text-error text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
}
