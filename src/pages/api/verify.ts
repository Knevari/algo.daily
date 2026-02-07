import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { Registry } from "@/infrastructure/Registry";
import { SolveProblemUseCase } from "@/core/application/use-cases/SolveProblemUseCase";

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
        // Instantiate Dependencies and Use Case via Registry
        const userRepository = Registry.getUserRepository();
        const problemRepository = Registry.getProblemRepository();
        const codeExecutionService = Registry.getCodeExecutionService();

        const useCase = new SolveProblemUseCase(
            userRepository,
            problemRepository,
            codeExecutionService
        );

        // Execute Use Case
        const result = await useCase.execute({
            userId: session.user.id,
            problemId,
            code,
            language
        });

        if (!result.success) {
            return res.status(result.message.includes("not found") ? 404 : 400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Verification API error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

