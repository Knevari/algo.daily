import type { LeaderboardEntry } from '@/actions/leaderboard';

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    currentUserId: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
    return (
        <div className="bg-bg-secondary border border-border rounded-md overflow-hidden h-full flex flex-col">
            <div className="p-md border-b border-border flex justify-between items-center bg-bg-tertiary">
                <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">Top Learners</h3>
                <span className="text-[10px] px-2 py-0.5 bg-accent-orange/10 text-accent-orange rounded-full font-mono border border-accent-orange/20">
                    WEEKLY_RANKING
                </span>
            </div>

            <div className="p-xs flex-1 overflow-y-auto custom-scrollbar">
                {entries.map((entry, index) => {
                    const isMe = entry.id === currentUserId;
                    const rank = index + 1;
                    const isTop3 = rank <= 3;

                    return (
                        <div
                            key={entry.id}
                            className={`flex items-center px-sm py-2 mb-1 rounded-sm transition-all hover:bg-white/5 border-l-2 ${isMe
                                ? 'bg-accent-primary/10 border-accent-primary'
                                : 'border-transparent hover:border-text-secondary'
                                }`}
                        >
                            <span className={`w-6 font-mono font-bold text-sm text-center ${isTop3 ? 'text-accent-primary' : 'text-text-muted'
                                }`}>
                                {rank}
                            </span>

                            <div className="flex-1 flex items-center gap-sm ml-xs">
                                <div className="w-6 h-6 rounded-sm bg-bg-primary flex items-center justify-center overflow-hidden border border-border">
                                    {entry.image ? (
                                        <img src={entry.image} alt={entry.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold text-text-secondary">
                                            {entry.name?.[0] || 'U'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className={`text-xs font-medium ${isMe ? 'text-accent-primary' : 'text-text-primary'}`}>
                                        {entry.name || 'Anonymous User'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-md">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-mono font-bold text-text-secondary">
                                        {entry.streak}
                                    </span>
                                    <span className="text-[10px] opacity-60">🔥</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-accent-cyan w-[50px] text-right">
                                    {entry.xp}XP
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
