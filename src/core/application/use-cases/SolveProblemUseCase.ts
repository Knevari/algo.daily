import type { IUserRepository, IProblemRepository, ICodeExecutionService } from "../ports/OutboundPorts";

export interface SolveProblemInput {
    userId: string;
    problemId: string;
    code: string;
    language: string;
}

export interface SolveProblemOutput {
    success: boolean;
    message: string;
    xpEarned?: number;
    streakUpdated?: boolean;
    results?: any[];
    error?: string;
}

export class SolveProblemUseCase {
    constructor(
        private userRepository: IUserRepository,
        private problemRepository: IProblemRepository,
        private codeExecutionService: ICodeExecutionService
    ) { }

    async execute(input: SolveProblemInput): Promise<SolveProblemOutput> {
        const { userId, problemId, code, language } = input;

        // 1. Fetch Entities
        const user = await this.userRepository.findById(userId);
        if (!user) return { success: false, message: "User not found" };

        const problem = await this.problemRepository.findById(problemId);
        if (!problem) return { success: false, message: "Problem not found" };

        // 2. Parse Test Cases
        let testCases: any[] = [];
        try {
            testCases = JSON.parse(problem.getProperties().testCases || "[]");
        } catch (e) {
            return { success: false, message: "Invalid test case configuration" };
        }

        // 3. Verify Code
        try {
            const verificationResults = await this.codeExecutionService.execute(language, code, testCases);
            const passed = verificationResults.every((r: any) => r.passed);

            if (!passed) {
                return {
                    success: false,
                    message: "Solution failed verification.",
                    results: verificationResults
                };
            }

            // 4. Success: Record Progress
            const completedIds = await this.problemRepository.getCompletedProblemIds(userId);
            if (completedIds.includes(problemId)) {
                return { success: true, message: "Verified! (Already completed previously)", results: verificationResults };
            }

            await this.problemRepository.recordCompletion(userId, problemId);

            // 5. Update Domain Entities (Streaks, XP)
            let xpEarned = 50;

            user.addXp(xpEarned);
            await this.userRepository.updateStreak(userId, new Date());
            await this.userRepository.save(user);

            return {
                success: true,
                message: "✅ Problem Solved & Verified!",
                xpEarned,
                streakUpdated: true,
                results: verificationResults
            };

        } catch (e: any) {
            return { success: false, message: "Execution error", error: e.message };
        }
    }
}

