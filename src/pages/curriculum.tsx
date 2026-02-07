import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { db } from "@/lib/db";
import Link from "next/link";

interface CurriculumProblem {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    dayNumber: number;
    order: number;
    isCompleted: boolean;
    externalUrl: string;
}

interface CurriculumWeek {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    category: string;
    totalProblems: number;
    completedProblems: number;
    problems: CurriculumProblem[];
}

interface CurriculumPageProps {
    weeks: CurriculumWeek[];
    currentWeek: number;
    isAuthenticated: boolean;
}

export default function CurriculumPage({ weeks, currentWeek, isAuthenticated }: CurriculumPageProps) {
    const [expandedWeek, setExpandedWeek] = useState<number | null>(currentWeek);
    const [userCurrentWeek, setUserCurrentWeek] = useState(currentWeek);

    const handleSetCurrentWeek = async (weekNumber: number) => {
        if (!isAuthenticated) return;

        const response = await fetch("/api/curriculum/set-week", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ weekNumber }),
        });

        if (response.ok) {
            setUserCurrentWeek(weekNumber);
        }
    };

    const totalProblems = weeks.reduce((acc, w) => acc + w.totalProblems, 0);
    const completedProblems = weeks.reduce((acc, w) => acc + w.completedProblems, 0);
    const overallProgress = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

    return (
        <>
            <Head>
                <title>Curriculum - AlgoDaily</title>
                <meta name="description" content="Your 12-week journey to mastering technical interviews" />
            </Head>

            <div className="min-h-screen pb-4xl">
                <header className="bg-gradient-to-b from-bg-secondary to-bg-primary pt-3xl px-lg pb-2xl border-b border-white/5 text-center">
                    <Link href="/" className="inline-block mb-lg text-text-secondary text-sm hover:text-white transition-colors">← Back to Dashboard</Link>
                    <h1 className="text-4xl font-extrabold mb-sm">
                        <span className="gradient-text">12-Week Curriculum</span>
                    </h1>
                    <p className="text-text-secondary text-lg mb-xl max-w-[600px] mx-auto">
                        Master technical interviews from Arrays to Dynamic Programming
                    </p>

                    {/* Overall Progress */}
                    <div className="max-w-[600px] mx-auto bg-white/5 p-lg rounded-xl border border-white/10">
                        <div className="flex justify-between text-sm font-medium mb-sm">
                            <span className="text-text-primary">{completedProblems} / {totalProblems} problems</span>
                            <span className="text-accent-primary">{Math.round(overallProgress)}% complete</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-accent-primary to-purple-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${overallProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </header>

                <main className="max-w-[800px] mx-auto px-lg -mt-lg">
                    <div className="flex flex-col gap-lg">
                        {weeks.map((week, index) => {
                            const isExpanded = expandedWeek === week.weekNumber;
                            const isCurrent = week.weekNumber === userCurrentWeek;
                            const progress = week.totalProblems > 0
                                ? (week.completedProblems / week.totalProblems) * 100
                                : 0;
                            const isComplete = progress === 100;

                            return (
                                <motion.div
                                    key={week.id}
                                    className={`mb-lg border border-white/5 overflow-hidden transition-all hover:border-white/10 glass-card ${isCurrent ? 'border-accent-primary/30 shadow-[0_0_20px_rgba(255,107,53,0.1)]' : ""} ${isComplete ? 'border-success/30' : ""}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <button
                                        className="w-full flex items-center justify-between p-lg bg-transparent border-none text-left cursor-pointer transition-colors hover:bg-white/5"
                                        onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                                    >
                                        <div className="flex items-center gap-md">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-white/5 border border-white/10 ${isComplete ? 'bg-success/20 text-success border-success/30' : 'text-text-secondary'}`}>
                                                {isComplete ? "✓" : `W${week.weekNumber}`}
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-lg font-bold text-text-primary mb-0.5">{week.title}</h3>
                                                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{week.category}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-lg max-sm:gap-sm">
                                            <div className="w-[80px] h-1.5 bg-bg-tertiary rounded-full overflow-hidden max-sm:hidden">
                                                <div
                                                    className="h-full bg-success rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-text-muted">
                                                {week.completedProblems}/{week.totalProblems}
                                            </span>
                                            <span className={`text-text-muted transition-transform duration-300 transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                className="border-t border-white/5 bg-black/20"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <p className="p-lg text-text-secondary text-sm leading-relaxed">{week.description}</p>

                                                {isAuthenticated && !isCurrent && (
                                                    <button
                                                        className="mx-lg mb-lg btn btn-ghost text-xs py-2 px-3 border border-dashed border-text-muted text-text-muted hover:border-text-primary hover:text-text-primary"
                                                        onClick={() => handleSetCurrentWeek(week.weekNumber)}
                                                    >
                                                        📍 Set as Current Week
                                                    </button>
                                                )}

                                                {isCurrent && (
                                                    <div className="mx-lg mb-lg inline-flex items-center gap-xs px-sm py-xs bg-accent-primary/10 text-accent-primary text-xs font-bold rounded-md">
                                                        📍 Your Current Week
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-md p-lg pt-0">
                                                    {[1, 2, 3, 4, 5, 6, 7].map(day => {
                                                        const dayProblems = week.problems.filter(p => p.dayNumber === day);
                                                        if (dayProblems.length === 0) return null;

                                                        return (
                                                            <div key={day} className="bg-white/5 rounded-lg p-md border border-white/5">
                                                                <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-md">Day {day}</h4>
                                                                <div className="flex flex-col gap-sm">
                                                                    {dayProblems.map(problem => (
                                                                        <a
                                                                            key={problem.id}
                                                                            href={problem.externalUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={`flex items-center gap-sm p-sm rounded-md transition-all hover:bg-white/5 group ${problem.isCompleted ? 'opacity-60 hover:opacity-100' : ""}`}
                                                                        >
                                                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${problem.isCompleted ? 'bg-success text-white border-success' : 'border-text-muted text-transparent'}`}>
                                                                                {problem.isCompleted ? "✓" : "○"}
                                                                            </span>
                                                                            <span className="flex-1 text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                                                                                {problem.title}
                                                                            </span>
                                                                            <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'} text-[10px] px-1.5 py-0.5`}>
                                                                                {problem.difficulty}
                                                                            </span>
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    const userId = session?.user?.id;

    // Fetch all weeks with problems
    const weeks = await db.curriculumWeek.findMany({
        orderBy: { weekNumber: "asc" },
        include: {
            problems: {
                include: { problem: true },
                orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
            },
        },
    });

    // Get user's completed problems
    const completedProblemIds = userId
        ? (await db.userProblem.findMany({
            where: { userId },
            select: { problemId: true },
        })).map(p => p.problemId)
        : [];

    // Get user's current week
    const progress = userId
        ? await db.userCurriculumProgress.findUnique({
            where: { userId },
        })
        : null;

    const formattedWeeks = weeks.map(week => ({
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        category: week.category,
        totalProblems: week.problems.length,
        completedProblems: week.problems.filter(p =>
            completedProblemIds.includes(p.problemId)
        ).length,
        problems: week.problems.map(cp => ({
            id: cp.id,
            title: cp.problem.title,
            slug: cp.problem.slug,
            difficulty: cp.problem.difficulty,
            dayNumber: cp.dayNumber,
            order: cp.order,
            isCompleted: completedProblemIds.includes(cp.problemId),
            externalUrl: cp.problem.externalUrl,
        })),
    }));

    return {
        props: {
            weeks: formattedWeeks,
            currentWeek: progress?.currentWeek ?? 1,
            isAuthenticated: !!userId,
        },
    };
};
