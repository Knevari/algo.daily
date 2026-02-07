import { motion } from 'framer-motion';
import { StreakCard } from './StreakCard';
import { ProblemCard } from './ProblemCard';
import { NotificationPrompt } from './NotificationPrompt';
import { StoreModal } from './StoreModal';
import { Leaderboard } from './Leaderboard';
import { UserMenu } from './UserMenu';
import { LeetCodeConnectModal } from './LeetCodeConnect';
import { CurriculumWidget } from './CurriculumWidget';
import { BonusProblems } from './BonusProblems';
import { useState } from 'react';
import { sounds } from '@/lib/sounds';
import type { LeaderboardEntry } from '@/actions/leaderboard';

interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    externalUrl: string;
}

interface User {
    id: string;
    name?: string | null;
    image?: string | null;
    streak: number;
    maxStreak: number;
    streakFreezes: number;
    xp: number;
    gems: number;
    lastStudiedAt?: Date | string | null;
    leetcodeUsername?: string | null;
}

interface CurriculumInfo {
    currentWeek: number;
    weekTitle: string;
    weekProgress: number;
    totalProgress: number;
}

interface DashboardProps {
    user: User;
    todaysProblems: Problem[];
    completedProblemIds: string[];
    leaderboard: LeaderboardEntry[];
    onVerifyProblem: (problemId: string) => Promise<boolean>;
    curriculum?: CurriculumInfo;
    bonusProblems?: Problem[];
}

export function Dashboard({
    user,
    todaysProblems,
    completedProblemIds,
    leaderboard,
    onVerifyProblem,
    curriculum,
    bonusProblems = []
}: DashboardProps) {
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [isLeetCodeConnectOpen, setIsLeetCodeConnectOpen] = useState(false);
    const completedCount = completedProblemIds.length;
    const targetCount = 2; // Daily Duo
    const progressPercent = (completedCount / targetCount) * 100;

    // Show LeetCode connect prompt if not connected
    const showConnectPrompt = !user.leetcodeUsername;

    return (
        <div className="min-h-screen pb-2xl bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-white">
            {/* Header */}
            <header className="flex justify-between items-center px-xl py-lg border-b border-border bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-50 max-sm:p-md">
                <div className="flex items-center">
                    <motion.h1
                        className="text-2xl font-bold font-mono tracking-tight flex items-center gap-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-accent-primary">{`{`}</span>
                        <span className="bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">AlgoDaily</span>
                        <span className="text-accent-primary">{`}`}</span>
                    </motion.h1>
                </div>

                <div className="flex items-center gap-xl">
                    <div className="flex gap-md max-sm:gap-sm">
                        <div className="group flex items-center gap-xs px-md py-sm bg-bg-tertiary border border-border hover:border-accent-primary/50 transition-colors rounded-sm cursor-pointer max-sm:px-sm max-sm:py-xs" onClick={() => { setIsStoreOpen(true); sounds.playClick(); }}>
                            <span className="text-base group-hover:scale-110 transition-transform">⚡</span>
                            <span className="font-mono font-bold text-sm text-accent-cyan">{user.xp.toLocaleString()}</span>
                        </div>
                        <div className="group flex items-center gap-xs px-md py-sm bg-bg-tertiary border border-border hover:border-accent-primary/50 transition-colors rounded-sm cursor-pointer max-sm:px-sm max-sm:py-xs" onClick={() => { setIsStoreOpen(true); sounds.playClick(); }}>
                            <span className="text-base group-hover:scale-110 transition-transform">💎</span>
                            <span className="font-mono font-bold text-sm text-accent-primary">{user.gems}</span>
                        </div>
                        <div className="group flex items-center gap-xs px-md py-sm bg-bg-tertiary border border-border hover:border-accent-primary/50 transition-colors rounded-sm cursor-pointer max-sm:px-sm max-sm:py-xs" onClick={() => { setIsStoreOpen(true); sounds.playClick(); }}>
                            <span className="text-base group-hover:scale-110 transition-transform">❄️</span>
                            <span className="font-mono font-bold text-sm text-text-secondary">{user.streakFreezes}</span>
                        </div>
                    </div>

                    <UserMenu
                        userImage={user.image}
                        userName={user.name}
                        leetcodeUsername={user.leetcodeUsername}
                        onConnectLeetCode={() => setIsLeetCodeConnectOpen(true)}
                    />
                </div>
            </header>

            <StoreModal
                isOpen={isStoreOpen}
                onClose={() => setIsStoreOpen(false)}
                userXp={user.xp}
                userFreezes={user.streakFreezes}
            />

            <LeetCodeConnectModal
                isOpen={isLeetCodeConnectOpen}
                onClose={() => setIsLeetCodeConnectOpen(false)}
                currentUsername={user.leetcodeUsername}
            />

            {/* Main Content */}
            <main className="max-w-[1000px] mx-auto px-lg py-2xl max-sm:p-lg grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-xl">
                <div className="space-y-2xl">
                    <NotificationPrompt />

                    {/* Daily Duo Section - Terminal Style */}
                    <section>
                        <div className="flex justify-between items-end mb-lg border-b border-border pb-sm">
                            <div>
                                <h2 className="text-xl font-mono font-bold text-accent-green flex items-center gap-2">
                                    <span className="text-text-muted">$</span>
                                    <span>./algo-daily.sh</span>
                                </h2>
                                <p className="text-text-muted text-sm mt-1 font-mono">
                                    // Complete 2 problems to maintain streak
                                </p>
                            </div>

                            {/* Progress Indicator */}
                            <div className="flex items-center gap-sm font-mono text-sm">
                                <span className={completedCount >= 1 ? "text-accent-primary" : "text-border"}>[*]</span>
                                <span className={completedCount >= 2 ? "text-accent-primary" : "text-border"}>[*]</span>
                                <span className="text-text-primary ml-2">{completedCount}/{targetCount}</span>
                            </div>
                        </div>

                        <div className="grid gap-md">
                            {todaysProblems.map((problem, index) => (
                                <motion.div
                                    key={problem.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ProblemCard
                                        problem={problem}
                                        isCompleted={completedProblemIds.includes(problem.id)}
                                        onVerify={onVerifyProblem}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Bonus Problems Section */}
                    {bonusProblems.length > 0 && (
                        <BonusProblems
                            problems={bonusProblems}
                            completedProblemIds={completedProblemIds}
                            onVerify={onVerifyProblem}
                        />
                    )}

                    {/* Motivational Console Output */}
                    {completedCount === targetCount && (
                        <motion.section
                            className="bg-bg-tertiary border border-accent-green/30 rounded-md p-lg font-mono text-sm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-accent-green mb-xs">Success! Daily targets acquired.</div>
                            <div className="text-text-secondary">
                                Cannot verify system integrity... Just kidding.
                                <br />
                                <span className="text-accent-primary">Streak: {user.streak} days active.</span>
                            </div>
                        </motion.section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-xl">
                    {/* Streak Card */}
                    <StreakCard
                        currentStreak={user.streak}
                        maxStreak={user.maxStreak}
                        streakFreezes={user.streakFreezes}
                        lastStudiedAt={user.lastStudiedAt}
                    />

                    {/* Curriculum Widget */}
                    {curriculum && (
                        <CurriculumWidget
                            currentWeek={curriculum.currentWeek}
                            weekTitle={curriculum.weekTitle}
                            weekProgress={curriculum.weekProgress}
                            totalProgress={curriculum.totalProgress}
                        />
                    )}

                    {/* Leaderboard Section */}
                    <div className="h-[400px]">
                        <Leaderboard entries={leaderboard} currentUserId={user.id} />
                    </div>
                </aside>
            </main>
        </div >
    );
}
