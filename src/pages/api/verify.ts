import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "@/lib/db";
import { executePiston } from "@/lib/piston";

const XP_PER_PROBLEM = 50;
const XP_STREAK_BONUS = 25;
const DAILY_TARGET = 2;

// ... (imports remain)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { problemId, code, language } = req.body;

    if (!problemId) {
        return res.status(400).json({ success: false, message: "Problem ID required" });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                streak: true,
                xp: true,
                lastStudiedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get the problem with test cases
        const problem = await db.problem.findUnique({
            where: { id: problemId },
            select: { id: true, slug: true, title: true, testCases: true },
        });

        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        // Parse test cases
        let testCases: any[] = [];
        try {
            testCases = JSON.parse(problem.testCases || "[]");
        } catch (e) {
            console.error("Failed to parse test cases", e);
            return res.status(500).json({ success: false, message: "System error: Invalid test cases" });
        }

        if (testCases.length === 0) {
            // Fallback: If no test cases are in DB, we cannot verify.
            // For now, fail safe or allow? 
            // Better to allow if we are migrating, but goal is security.
            // Let's assume we seeded Two Sum, so valid problems have cases.
            // If empty, return error or maybe strictly require them.
            if (language && code) {
                return res.status(400).json({ success: false, message: "Verification not configured for this problem." });
            }
        }

        // *** VERIFICATION LOGIC ***
        let passed = false;
        let verificationResults: any[] = [];

        if (code && language) {
            try {
                if (language === 'javascript') {
                    const { runJavaScriptServer } = await import("@/lib/serverJsRunner");
                    verificationResults = runJavaScriptServer(code, testCases);
                    passed = verificationResults.every(r => r.passed);
                } else {
                    // Piston Execution for other languages
                    let fullCode = "";
                    let version = "";

                    switch (language) {
                        case 'python': {
                            const { pythonRunner } = await import('@/lib/languages/python');
                            fullCode = pythonRunner(code, testCases);
                            version = "3.10.0";
                            break;
                        }
                        case 'rust': {
                            const { rustRunner } = await import('@/lib/languages/rust');
                            fullCode = rustRunner(code, testCases);
                            version = "1.68.2";
                            break;
                        }
                        case 'cpp': {
                            const { cppRunner } = await import('@/lib/languages/cpp');
                            fullCode = cppRunner(code, testCases);
                            version = "10.2.0";
                            break;
                        }
                        case 'java': {
                            const { javaRunner } = await import('@/lib/languages/java');
                            fullCode = javaRunner(code, testCases);
                            version = "15.0.2";
                            break;
                        }
                        default:
                            return res.status(400).json({ success: false, message: "Unsupported language" });
                    }

                    const { executePiston } = await import('@/lib/piston');
                    const pistonLang = language === 'cpp' ? 'c++' : language;
                    const response = await executePiston(pistonLang, version, fullCode);

                    if (response.run.stderr) {
                        return res.status(400).json({ success: false, message: "Runtime/Compilation Error", error: response.run.stderr });
                    }

                    // Parse Output
                    const stdout = response.run.stdout.trim();
                    const jsonStart = stdout.lastIndexOf('---JSON_START---');
                    const jsonEnd = stdout.lastIndexOf('---JSON_END---');

                    if (jsonStart !== -1 && jsonEnd !== -1) {
                        const jsonStr = stdout.substring(jsonStart + '---JSON_START---'.length, jsonEnd).trim();
                        verificationResults = JSON.parse(jsonStr);
                        passed = verificationResults.every(r => r.passed);
                    } else {
                        console.error("Failed to parse output:", stdout);
                        return res.status(500).json({ success: false, message: "Failed to parse execution results" });
                    }
                }
            } catch (e: any) {
                console.error("Verification execution failed", e);
                return res.status(500).json({ success: false, message: `Execution failed: ${e.message}` });
            }

            if (!passed) {
                return res.status(200).json({
                    success: false,
                    message: "Solution failed verification on server.",
                    results: verificationResults
                });
            }
        } else {
            // No code provided? This should maybe be allowed ONLY if bypassing verification (e.g. dev mode)
            // But user requested security. So reject if no code.
            return res.status(400).json({ success: false, message: "Code and language required for verification." });
        }

        // *** SUCCESS: RECORD COMPLETION ***

        // ... (Existing logic for DB update)
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
            return res.status(200).json({ success: true, message: "Solution verified! (Already completed previously)", results: verificationResults });
        }

        // Record the completion
        await db.userProblem.create({
            data: {
                userId: user.id,
                problemId: problem.id,
                completedAt: new Date(),
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

        return res.status(200).json({
            success: true,
            message: streakUpdated
                ? "🎉 Daily goal complete! Streak updated!"
                : "✅ Problem Solved & Verified!",
            xpEarned,
            streakUpdated,
            results: verificationResults
        });

    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
