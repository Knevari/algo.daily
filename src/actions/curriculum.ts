"use server";

import { Registry } from "@/infrastructure/Registry";
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

    const curriculumRepo = Registry.getCurriculumRepository();
    const problemRepo = Registry.getProblemRepository();

    const weeks = await curriculumRepo.getAllWeeks();

    // Get user's completed problems
    const completedProblemIds = userId
        ? await problemRepo.getCompletedProblemIds(userId)
        : [];

    return weeks.map(week => {
        return {
            id: week.id,
            weekNumber: week.weekNumber,
            title: week.title,
            description: week.description,
            category: week.category,
            totalProblems: week.problems.length,
            completedProblems: week.problems.filter(p =>
                completedProblemIds.includes(p.problem.id)
            ).length,
        };
    });
}

/**
 * Get detailed week with all problems
 */
export async function getCurriculumWeek(weekNumber: number): Promise<CurriculumWeekDetail | null> {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const curriculumRepo = Registry.getCurriculumRepository();
    const problemRepo = Registry.getProblemRepository();

    const week = await curriculumRepo.getWeek(weekNumber);

    if (!week) return null;

    // Get user's completed problems
    const completedProblemIds = userId
        ? await problemRepo.getCompletedProblemIds(userId)
        : [];

    return {
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        category: week.category,
        totalProblems: week.problems.length,
        completedProblems: week.problems.filter(p =>
            completedProblemIds.includes(p.problem.id)
        ).length,
        problems: week.problems.map(cp => {
            const problemProps = cp.problem.getProperties();
            return {
                id: cp.problem.id,
                problemId: cp.problem.id,
                title: cp.problem.title,
                slug: cp.problem.slug,
                difficulty: problemProps.difficulty,
                dayNumber: cp.dayNumber,
                order: cp.order,
                isCompleted: completedProblemIds.includes(cp.problem.id),
                externalUrl: problemProps.externalUrl,
            };
        }),
    };
}

/**
 * Get user's current curriculum progress
 */
export async function getUserCurriculumProgress(): Promise<{ currentWeek: number } | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const curriculumRepo = Registry.getCurriculumRepository();
    const currentWeek = await curriculumRepo.getCurrentWeek(session.user.id);

    return { currentWeek };
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

    const curriculumRepo = Registry.getCurriculumRepository();
    await curriculumRepo.saveUserProgress(session.user.id, weekNumber);

    return { success: true };
}

/**
 * Get today's Daily Duo problems based on user's current week
 */
export async function getDailyDuoProblems() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const curriculumRepo = Registry.getCurriculumRepository();
    const problemRepo = Registry.getProblemRepository();

    // Get user's current week
    const currentWeek = await curriculumRepo.getCurrentWeek(session.user.id);

    // Calculate which day of the week we're on (1-7, cycling)
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date().getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const dayOfWeek = ((dayOfYear - 1) % 7) + 1; // 1-7

    // Get problems for this day
    const problems = await curriculumRepo.getDailyProblems(currentWeek, dayOfWeek);

    // Get completion status
    const completedProblemIds = await problemRepo.getCompletedProblemIds(session.user.id);

    return problems.map(problem => {
        const props = problem.getProperties();
        return {
            id: props.id,
            title: props.title,
            slug: props.slug,
            difficulty: props.difficulty,
            category: props.category,
            externalUrl: props.externalUrl,
            isCompleted: completedProblemIds.includes(props.id),
        };
    });
}
