import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
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
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
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
            const hint = result.response.text();

            if (hint) {
                return res.status(200).json({
                    success: true,
                    hint: hint.trim(),
                    hintLevel: hintLevel + 1
                });
            }
        }

        // Fallback to Expert Hints Library if no API key or failure
        const hint = getExpertHint(slug, hintLevel);

        return res.status(200).json({
            success: true,
            hint,
            hintLevel: hintLevel + 1
        });
    } catch (error) {
        console.error("Hint API error:", error);

        // Final fallback even on error
        const hint = getExpertHint(slug, hintLevel);
        return res.status(200).json({
            success: true,
            hint,
            hintLevel: hintLevel + 1
        });
    }
}
