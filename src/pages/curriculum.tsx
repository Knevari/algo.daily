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
    userPlan: string;
}

export default function CurriculumPage({ weeks, currentWeek, isAuthenticated, userPlan }: CurriculumPageProps) {
    const isPro = userPlan === "PRO" || userPlan === "LIFETIME";
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

    const handleCheckout = async (planType: string) => {
        const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planType }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
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
                    <div className="max-w-[600px] mx-auto bg-white/5 p-lg rounded-xl border border-white/10 mb-xl">
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

                    {!isPro && (
                        <div className="mt-2xl grid grid-cols-1 md:grid-cols-2 gap-lg max-w-[700px] mx-auto">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-bg-tertiary border border-border border-t-accent-primary border-t-4 p-lg rounded-xl flex flex-col items-center justify-between shadow-xl"
                            >
                                <div className="text-center w-full">
                                    <h3 className="font-bold text-lg mb-1">AlgoDaily Monthly</h3>
                                    <p className="text-3xl font-bold mb-md mt-2 font-mono tracking-tight">$5<span className="text-xs text-text-muted font-normal">/mo</span></p>
                                    <ul className="text-sm text-text-secondary space-y-3 text-left mb-xl max-w-[220px] mx-auto">
                                        <li className="flex items-center gap-3 font-medium">
                                            <span className="text-accent-green font-bold">✓</span> Full 12-Week Roadmap
                                        </li>
                                        <li className="flex items-center gap-3 font-medium">
                                            <span className="text-accent-primary font-bold">✓</span> Gemini Technical Hints
                                        </li>
                                        <li className="flex items-center gap-3 font-medium">
                                            <span className="text-accent-cyan font-bold">✓</span> Integrated IDE Verify
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleCheckout('monthly')}
                                    className="btn btn-primary w-full text-xs py-3"
                                >
                                    Get Monthly Pro
                                </button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                className="relative bg-bg-secondary border-2 border-accent-primary p-lg rounded-2xl flex flex-col items-center justify-between shadow-[0_0_50px_rgba(217,70,239,0.3)] overflow-hidden scale-105 z-20"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [1, 0.8, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute top-0 right-0 bg-accent-primary text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-20 shadow-lg"
                                >
                                    BEST VALUE
                                </motion.div>

                                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-cyan/10 pointer-events-none" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-cyan" />

                                <div className="text-center relative z-10 pt-4 w-full">
                                    <div className="text-5xl mb-4 select-none">💎</div>
                                    <h3 className="font-black text-2xl mb-1 text-white tracking-tight uppercase leading-tight">Lifetime Master</h3>
                                    <div className="flex items-center justify-center gap-2 mb-md mt-2">
                                        <p className="text-5xl font-black text-white tracking-tighter font-mono">$50</p>
                                        <div className="text-left font-mono">
                                            <p className="text-[10px] text-accent-primary font-bold leading-none mb-1 uppercase">One-time</p>
                                            <p className="text-xs text-text-muted leading-none uppercase">Forever</p>
                                        </div>
                                    </div>
                                    <ul className="text-sm text-text-secondary space-y-3 text-left mb-xl max-w-[220px] mx-auto">
                                        <li className="flex items-center gap-3 font-medium text-white/90">
                                            <span className="text-accent-green font-bold text-base">✓</span> Unlimited Gemini PRO
                                        </li>
                                        <li className="flex items-center gap-3 font-medium text-white/90">
                                            <span className="text-accent-cyan font-bold text-base">✓</span> Full 12-Week Roadmap
                                        </li>
                                        <li className="flex items-center gap-3 font-medium text-white/90">
                                            <span className="text-accent-primary font-bold text-base">✓</span> Lifetime Free Updates
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleCheckout('lifetime')}
                                    className="relative z-10 w-full py-3 px-8 rounded-xl font-black text-xs tracking-widest transition-all duration-300 bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-[0_4px_20px_rgba(217,70,239,0.5)] hover:shadow-[0_6px_30px_rgba(217,70,239,0.7)] hover:scale-[1.05] active:scale-[0.95] uppercase border-b-4 border-accent-secondary/50"
                                >
                                    GET LIFETIME MASTER ACCESS
                                </button>
                            </motion.div>
                        </div>
                    )}
                </header>

                <main className="max-w-[800px] mx-auto px-lg -mt-lg relative z-10">
                    <div className="flex flex-col gap-lg">
                        {weeks.map((week, index) => {
                            const isExpanded = expandedWeek === week.weekNumber;
                            const isCurrent = week.weekNumber === userCurrentWeek;
                            const progress = week.totalProblems > 0
                                ? (week.completedProblems / week.totalProblems) * 100
                                : 0;
                            const isComplete = progress === 100;
                            const isLocked = week.weekNumber > 1 && !isPro;

                            return (
                                <motion.div
                                    key={week.id}
                                    className={`relative mb-lg border border-white/5 overflow-hidden transition-all hover:border-white/10 glass-card
                                        ${isCurrent ? 'border-accent-primary/30 shadow-[0_0_20px_rgba(255,107,53,0.1)]' : ""}
                                        ${isComplete ? 'border-success/30' : ""}
                                        ${isLocked ? 'cursor-not-allowed group/locked' : ''}
                                    `}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <button
                                        disabled={isLocked}
                                        className={`w-full flex items-center justify-between p-lg bg-transparent border-none text-left transition-colors
                                            ${isLocked ? 'grayscale opacity-80' : 'cursor-pointer hover:bg-white/5'}
                                        `}
                                        onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                                    >
                                        <div className={`flex items-center gap-md ${isLocked ? 'blur-[2px]' : ''}`}>
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

                                        {isLocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px] z-10 transition-opacity opacity-0 group-hover/locked:opacity-100">
                                                <div className="bg-accent-primary text-white px-md py-sm rounded-md font-bold text-sm shadow-lg flex items-center gap-2">
                                                    <span>🔒</span>
                                                    <span>GET PRO ACCESS</span>
                                                </div>
                                            </div>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && !isLocked && (
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
                                                                        <Link
                                                                            key={problem.id}
                                                                            href={`/solve/${problem.slug}`}
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
                                                                        </Link>
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
    const { mumble } = await import("@/lib/obfuscation");
    const session = await getServerSession(context.req, context.res, authOptions);
    const userId = session?.user?.id;

    const user = userId ? await db.user.findUnique({
        where: { id: userId },
        select: { plan: true }
    }) : null;

    const userPlan = user?.plan ?? "FREE";
    const isPro = userPlan === "PRO" || userPlan === "LIFETIME";

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

    const formattedWeeks = weeks.map(week => {
        const isLocked = week.weekNumber > 1 && !isPro;

        return {
            id: week.id,
            weekNumber: week.weekNumber,
            title: week.title,
            description: isLocked ? mumble(week.description) : week.description,
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
        };
    });

    return {
        props: {
            weeks: formattedWeeks,
            currentWeek: progress?.currentWeek ?? 1,
            isAuthenticated: !!userId,
            userPlan: userPlan,
        },
    };
};
