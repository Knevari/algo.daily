import { motion } from 'framer-motion';

interface StreakCardProps {
    currentStreak: number;
    maxStreak: number;
    streakFreezes: number;
    lastStudiedAt?: Date | string | null;
}

export function StreakCard({ currentStreak, maxStreak, streakFreezes, lastStudiedAt }: StreakCardProps) {
    return (
        <div className="bg-bg-tertiary border border-border rounded-md p-lg min-w-[280px] shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex justify-between items-center mb-lg">
                <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-widest">
                    STREAK_STATUS
                </h3>
                <div className="flex items-center gap-xs px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-sm text-[10px] font-mono font-bold text-cyan-400">
                    <span>❄</span>
                    <span>{streakFreezes} FREEZES</span>
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-md py-lg">
                <motion.div
                    className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]"
                    animate={{
                        scale: [1, 1.1, 0.95, 1.05, 1],
                        rotate: [-5, 5, -2, 2, 0],
                        filter: [
                            'drop-shadow(0 0 20px rgba(255,107,53,0.5))',
                            'drop-shadow(0 0 40px rgba(255,107,53,0.8))',
                            'drop-shadow(0 0 20px rgba(255,107,53,0.5))'
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    🔥
                </motion.div>

                <div className="text-center">
                    <div className="text-7xl font-mono font-black leading-none text-white tracking-tighter">
                        {currentStreak}
                    </div>
                    <div className="text-sm font-mono text-text-secondary uppercase tracking-widest mt-1">
                        Day Streak
                    </div>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 pt-lg border-t border-border mt-md">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-mono font-bold text-text-primary">{maxStreak}</span>
                    <span className="text-[10px] font-mono text-text-muted uppercase">Best</span>
                </div>
                <div className="flex flex-col items-center border-l border-border">
                    <span className="text-xl font-mono font-bold text-text-primary">
                        {lastStudiedAt ? new Date(lastStudiedAt).getDate() : '-'}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted uppercase">Last Day</span>
                </div>
            </div>
        </div>
    );
}
