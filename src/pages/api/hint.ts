import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { Registry } from "@/infrastructure/Registry";
import { RequestHintUseCase } from "@/core/application/use-cases/RequestHintUseCase";

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
        const userRepository = Registry.getUserRepository();
        const problemRepository = Registry.getProblemRepository();
        const aiService = Registry.getAIService();

        const useCase = new RequestHintUseCase(
            userRepository,
            problemRepository,
            aiService
        );

        const result = await useCase.execute({
            userId: session.user.id,
            slug,
            code,
            language,
            hintLevel
        });

        if (!result.success) {
            return res.status(result.limitReached ? 403 : 400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Hint API error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

