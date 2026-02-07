import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "@/lib/db";
import { getExpertHint } from "@/lib/hints";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const { slug, hintLevel = 0, code = "", language = "" } = req.body;

    if (!slug) {
        return res.status(400).json({ success: false, message: "Problem slug required" });
    }

    try {
        // Fetch user monetization data
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                plan: true,
                hintCount: true,
                lastHintAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPro = user.plan === "PRO" || user.plan === "LIFETIME";
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastHintDate = user.lastHintAt ? new Date(user.lastHintAt) : null;
        if (lastHintDate) lastHintDate.setHours(0, 0, 0, 0);

        let currentHintCount = user.hintCount;

        // Reset count if it's a new day
        if (!lastHintDate || lastHintDate.getTime() < today.getTime()) {
            currentHintCount = 0;
        }

        // Check limit for FREE users
        if (!isPro && currentHintCount >= 3) {
            return res.status(403).json({
                success: false,
                message: "Daily hint limit reached! Upgrade to AlgoDaily Pro for unlimited hints.",
                limitReached: true
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        let hint = "";

        if (apiKey) {
            // ... (Gemini logic)
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: "You are a senior algorithm instructor. Provide a brief, CONCEPTUAL hint for a coding problem. NEVER provide the solution code. Focus on the strategy, data structure, or an edge case. Keep it under 2 sentences. Be encouraging but cryptic."
                });

                const prompt = `
                    Problem: ${slug}
                    Language: ${language}
                    Current User Code:
                    \`\`\`${language}
                    ${code}
                    \`\`\`
                    Hint Level Request: ${hintLevel + 1} (Level 1 is very vague, higher levels provide more specific conceptual direction)

                    Provide the next conceptual hint.
                `;

                const result = await model.generateContent(prompt);
                hint = result.response.text();
            } catch (err) {
                console.error("Gemini failed", err);
            }
        }

        if (!hint) {
            // Fallback to Expert Hints Library
            hint = getExpertHint(slug, hintLevel);
        }

        // Update user hint usage
        await db.user.update({
            where: { id: session.user.id },
            data: {
                hintCount: currentHintCount + 1,
                lastHintAt: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            hint: hint.trim(),
            hintLevel: hintLevel + 1
        });
    } catch (error) {
        console.error("Hint API error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
