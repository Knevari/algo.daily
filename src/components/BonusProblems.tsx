import { motion } from 'framer-motion';
import { ProblemCard } from './ProblemCard';

interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    externalUrl: string;
}

interface BonusProblemsProps {
    problems: Problem[];
    completedProblemIds: string[];
    onVerify: (problemId: string) => Promise<boolean>;
}

export function BonusProblems({ problems, completedProblemIds, onVerify }: BonusProblemsProps) {
    if (problems.length === 0) return null;

    return (
        <motion.section
            className="mt-xl pt-xl border-t border-dashed border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center gap-md mb-sm">
                <h3 className="text-xl font-semibold flex items-center gap-sm">
                    <span className="text-2xl">⚡</span>
                    Extra Credit
                </h3>
                <span className="bg-gradient-to-br from-purple-primary to-accent-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    +XP Only
                </span>
            </div>
            <p className="text-text-muted text-sm mb-lg">
                Bonus problems for extra XP. These don&apos;t affect your daily streak.
            </p>

            <div className="flex flex-col gap-md">
                {problems.map((problem, index) => (
                    <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <ProblemCard
                            problem={problem}
                            isCompleted={completedProblemIds.includes(problem.id)}
                            onVerify={onVerify}
                        // isBonus is used for formatting, not passed as part of Problem interface but checked in Card
                        />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
