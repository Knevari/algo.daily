import Link from 'next/link';
import { motion } from 'framer-motion';


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
}

export function BonusProblems({ problems, completedProblemIds }: BonusProblemsProps) {
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

            <div className="flex flex-col gap-2">
                {problems.map((problem, index) => (
                    <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                    >
                        <div className="group flex items-center justify-between p-3 bg-bg-card/30 border border-border/50 rounded-sm hover:bg-bg-tertiary hover:border-accent-primary/30 transition-all">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <span className={`shrink-0 text-[10px] font-mono w-14 text-center py-0.5 rounded border ${problem.difficulty === 'Easy' ? 'text-accent-green border-accent-green/20 bg-accent-green/5' :
                                    problem.difficulty === 'Medium' ? 'text-accent-orange border-accent-orange/20 bg-accent-orange/5' :
                                        'text-error border-error/20 bg-error/5'
                                    }`}>
                                    {problem.difficulty}
                                </span>

                                <h4 className="text-sm font-mono text-text-secondary truncate group-hover:text-text-primary transition-colors">
                                    {problem.title}
                                </h4>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/solve/${problem.slug}`}
                                    className={`px-3 py-1 text-xs font-mono font-bold rounded-sm transition-all ${completedProblemIds.includes(problem.id)
                                        ? 'bg-accent-green/10 text-accent-green cursor-default'
                                        : 'bg-accent-primary text-bg-primary hover:bg-accent-primary/90'
                                        }`}
                                >
                                    {completedProblemIds.includes(problem.id) ? 'DONE' : 'SOLVE'}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
