"use server";

import { db } from "@/lib/db";
import { verifyProblemCompletion } from "@/lib/leetcode";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const XP_PER_PROBLEM = 50;
const XP_STREAK_BONUS = 25;
const DAILY_TARGET = 2;

interface VerifyResult {
    success: boolean;
    message: string;
    xpEarned?: number;
    streakUpdated?: boolean;
}

/**
 * Server Action: Verify a problem completion for the current user
 */
export async function verifyProblem(problemId: string): Promise<VerifyResult> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, message: "Not authenticated" };
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            leetcodeUsername: true,
            streak: true,
            xp: true,
            lastStudiedAt: true,
        },
    });

    if (!user) {
        return { success: false, message: "User not found" };
    }

    if (!user.leetcodeUsername) {
        return {
            success: false,
            message: "Please connect your LeetCode account first",
        };
    }

    // Get the problem
    const problem = await db.problem.findUnique({
        where: { id: problemId },
        select: { id: true, slug: true, title: true },
    });

    if (!problem) {
        return { success: false, message: "Problem not found" };
    }

    // Check if already completed
    const existingCompletion = await db.userProblem.findUnique({
        where: {
            userId_problemId: {
                userId: user.id,
                problemId: problem.id,
            },
        },
    });

    if (existingCompletion) {
        return { success: true, message: "Already verified!" };
    }

    // Verify with LeetCode API
    const verification = await verifyProblemCompletion(
        user.leetcodeUsername,
        problem.slug
    );

    if (!verification.verified) {
        return {
            success: false,
            message: `Solve "${problem.title}" on LeetCode first, then check again!`,
        };
    }

    // Record the completion
    await db.userProblem.create({
        data: {
            userId: user.id,
            problemId: problem.id,
            completedAt: verification.timestamp ?? new Date(),
        },
    });

    // Calculate XP
    let xpEarned = XP_PER_PROBLEM;
    let streakUpdated = false;

    // Check daily progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyProgress = await db.dailyProgress.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });

    if (!dailyProgress) {
        dailyProgress = await db.dailyProgress.create({
            data: {
                userId: user.id,
                date: today,
                problemsSolved: 1,
                target: DAILY_TARGET,
            },
        });
    } else {
        dailyProgress = await db.dailyProgress.update({
            where: { id: dailyProgress.id },
            data: {
                problemsSolved: dailyProgress.problemsSolved + 1,
            },
        });
    }

    // Check if daily goal complete
    if (dailyProgress.problemsSolved >= DAILY_TARGET && !dailyProgress.isCompleted) {
        // Mark day as complete
        await db.dailyProgress.update({
            where: { id: dailyProgress.id },
            data: { isCompleted: true },
        });

        // Update streak
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const wasActiveYesterday =
            user.lastStudiedAt &&
            new Date(user.lastStudiedAt).toDateString() === yesterday.toDateString();

        const newStreak = wasActiveYesterday ? user.streak + 1 : 1;
        xpEarned += XP_STREAK_BONUS;
        streakUpdated = true;

        await db.user.update({
            where: { id: user.id },
            data: {
                streak: newStreak,
                maxStreak: Math.max(newStreak, user.streak),
                lastStudiedAt: new Date(),
                xp: user.xp + xpEarned,
            },
        });
    } else {
        // Just update XP
        await db.user.update({
            where: { id: user.id },
            data: { xp: user.xp + xpEarned },
        });
    }

    return {
        success: true,
        message: streakUpdated
            ? "🎉 Daily goal complete! Streak updated!"
            : "✅ Problem verified!",
        xpEarned,
        streakUpdated,
    };
}

/**
 * Server Action: Set LeetCode username for the current user
 */
export async function setLeetCodeUsername(
    username: string
): Promise<{ success: boolean; message: string }> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, message: "Not authenticated" };
    }

    // Validate the username exists
    const { validateLeetCodeUsername } = await import("@/lib/leetcode");
    const isValid = await validateLeetCodeUsername(username);

    if (!isValid) {
        return {
            success: false,
            message: "LeetCode username not found or profile is private",
        };
    }

    await db.user.update({
        where: { id: session.user.id },
        data: { leetcodeUsername: username },
    });

    return { success: true, message: "LeetCode account connected!" };
}
