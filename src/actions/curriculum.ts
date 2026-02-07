"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export interface CurriculumWeekSummary {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    category: string;
    totalProblems: number;
    completedProblems: number;
}

export interface CurriculumProblemDetail {
    id: string;
    problemId: string;
    title: string;
    slug: string;
    difficulty: string;
    dayNumber: number;
    order: number;
    isCompleted: boolean;
    externalUrl: string;
}

export interface CurriculumWeekDetail extends CurriculumWeekSummary {
    problems: CurriculumProblemDetail[];
}

/**
 * Get curriculum overview with completion stats
 */
export async function getCurriculumOverview(): Promise<CurriculumWeekSummary[]> {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const weeks = await db.curriculumWeek.findMany({
        orderBy: { weekNumber: "asc" },
        include: {
            problems: {
                include: {
                    problem: true,
                },
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

    return weeks.map(week => ({
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        category: week.category,
        totalProblems: week.problems.length,
        completedProblems: week.problems.filter(p =>
            completedProblemIds.includes(p.problemId)
        ).length,
    }));
}

/**
 * Get detailed week with all problems
 */
export async function getCurriculumWeek(weekNumber: number): Promise<CurriculumWeekDetail | null> {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const week = await db.curriculumWeek.findUnique({
        where: { weekNumber },
        include: {
            problems: {
                include: {
                    problem: true,
                },
                orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
            },
        },
    });

    if (!week) return null;

    // Get user's completed problems
    const completedProblemIds = userId
        ? (await db.userProblem.findMany({
            where: { userId },
            select: { problemId: true },
        })).map(p => p.problemId)
        : [];

    return {
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
            problemId: cp.problem.id,
            title: cp.problem.title,
            slug: cp.problem.slug,
            difficulty: cp.problem.difficulty,
            dayNumber: cp.dayNumber,
            order: cp.order,
            isCompleted: completedProblemIds.includes(cp.problemId),
            externalUrl: cp.problem.externalUrl,
        })),
    };
}

/**
 * Get user's current curriculum progress
 */
export async function getUserCurriculumProgress(): Promise<{ currentWeek: number } | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const progress = await db.userCurriculumProgress.findUnique({
        where: { userId: session.user.id },
    });

    return progress ? { currentWeek: progress.currentWeek } : { currentWeek: 1 };
}

/**
 * Update user's current week (jump ahead)
 */
export async function setCurrentWeek(weekNumber: number): Promise<{ success: boolean }> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false };

    if (weekNumber < 1 || weekNumber > 12) {
        return { success: false };
    }

    await db.userCurriculumProgress.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            currentWeek: weekNumber,
        },
        update: {
            currentWeek: weekNumber,
        },
    });

    return { success: true };
}

/**
 * Get today's Daily Duo problems based on user's current week
 */
export async function getDailyDuoProblems() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    // Get user's current week
    const progress = await db.userCurriculumProgress.findUnique({
        where: { userId: session.user.id },
    });
    const currentWeek = progress?.currentWeek ?? 1;

    // Calculate which day of the week we're on (1-7, cycling)
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date().getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const dayOfWeek = ((dayOfYear - 1) % 7) + 1; // 1-7

    // Get problems for this day
    const problems = await db.curriculumProblem.findMany({
        where: {
            week: { weekNumber: currentWeek },
            dayNumber: dayOfWeek,
        },
        include: {
            problem: true,
            week: true,
        },
        orderBy: { order: "asc" },
    });

    // Get completion status
    const completedProblemIds = (await db.userProblem.findMany({
        where: { userId: session.user.id },
        select: { problemId: true },
    })).map(p => p.problemId);

    return problems.map(cp => ({
        id: cp.problem.id,
        title: cp.problem.title,
        slug: cp.problem.slug,
        difficulty: cp.problem.difficulty,
        category: cp.week?.category ?? cp.problem.category,
        externalUrl: cp.problem.externalUrl,
        isCompleted: completedProblemIds.includes(cp.problemId),
    }));
}
