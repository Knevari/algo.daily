import Link from 'next/link';
import { useState } from 'react';

interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    externalUrl: string;
    isBonus?: boolean;
}

interface ProblemCardProps {
    problem: Problem;
    isCompleted: boolean;
    onVerify: (problemId: string) => Promise<boolean>;
}

export function ProblemCard({ problem, isCompleted, onVerify }: ProblemCardProps) {
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            await onVerify(problem.id);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className={`relative p-lg group transition-all duration-300 bg-bg-card backdrop-blur-md border rounded-md hover:scale-[1.01] ${isCompleted
            ? 'border-accent-green/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-accent-green/5'
            : 'border-border hover:border-accent-primary hover:shadow-[0_0_15px_rgba(217,70,239,0.1)]'
            } ${problem.isBonus ? 'border-dashed border-accent-secondary' : ''}`}>

            <div className="relative z-10">
                <div className="flex items-center gap-sm mb-md">
                    <span className={`px-2 py-0.5 rounded-sm font-mono text-[10px] uppercase tracking-wider font-bold border ${problem.difficulty === 'Easy'
                        ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                        : problem.difficulty === 'Medium'
                            ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
                            : 'bg-error/10 text-error border-error/20'
                        }`}>
                        {problem.difficulty}
                    </span>
                    <span className="text-xs text-text-muted font-mono">
                        {`// ${problem.category}`}
                    </span>
                    {problem.isBonus && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent-secondary/20 text-accent-secondary px-2 py-0.5 rounded-sm border border-accent-secondary/30 animate-pulse">
                            BONUS_XP
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-start gap-md mb-lg">
                    <h3 className="text-lg font-bold font-mono">
                        <Link
                            href={problem.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-primary transition-colors hover:text-accent-primary group-hover:text-accent-primary"
                        >
                            {problem.title}
                            <span className="text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2">_</span>
                        </Link>
                    </h3>
                </div>

                <div className="flex gap-md flex-wrap items-center">
                    <Link
                        href={problem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-sm font-mono text-sm border border-border bg-bg-tertiary text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors"
                    >
                        ./solve
                    </Link>

                    <button
                        className={`px-4 py-1.5 rounded-sm font-mono text-sm font-bold transition-all ${isCompleted
                            ? 'bg-accent-green/20 text-accent-green border border-accent-green/50 cursor-default'
                            : 'bg-accent-primary text-bg-primary hover:bg-accent-primary/90 hover:shadow-glow'
                            }`}
                        onClick={handleVerify}
                        disabled={isCompleted || isVerifying}
                    >
                        {isVerifying ? (
                            <span className="inline-block animate-spin">⟳</span>
                        ) : isCompleted ? (
                            'COMPLETED'
                        ) : (
                            'VERIFY_submission()'
                        )}
                    </button>

                    {problem.externalUrl.includes('leetcode.com') && (
                        <span className="text-xs text-text-muted ml-auto font-mono opacity-50">
                            [LeetCode]
                        </span>
                    )}
                </div>
            </div>

            {isCompleted && (
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-accent-green/20 blur-xl rounded-full pointer-events-none"></div>
            )}
        </div>
    );
}
