import { PrismaClient } from "@prisma/client";
import type { IProblemRepository } from "../../../core/application/ports/OutboundPorts";
import { Problem } from "../../../core/domain/Problem";

export class PrismaProblemRepository implements IProblemRepository {
    constructor(private prisma: PrismaClient) { }

    async findById(id: string): Promise<Problem | null> {
        const problem = await this.prisma.problem.findUnique({
            where: { id },
        });

        if (!problem) return null;

        return new Problem({
            ...problem,
            starterCode: problem.starterCode,
            testCases: problem.testCases,
            externalUrl: problem.externalUrl,
        });
    }

    async findBySlug(slug: string): Promise<Problem | null> {
        const problem = await this.prisma.problem.findUnique({
            where: { slug },
        });

        if (!problem) return null;

        const curriculumProblem = await this.prisma.curriculumProblem.findFirst({
            where: { problemId: problem.id },
            include: { week: true }
        });

        return new Problem({
            ...problem,
            starterCode: problem.starterCode,
            testCases: problem.testCases,
            externalUrl: problem.externalUrl,
            weekNumber: curriculumProblem?.week?.weekNumber
        });
    }

    async findTodaysProblems(userId: string): Promise<Problem[]> {
        const progress = await this.prisma.userCurriculumProgress.findUnique({
            where: { userId },
        });

        const currentWeekNum = progress?.currentWeek || 1;

        const curriculumProblems = await this.prisma.curriculumProblem.findMany({
            where: { week: { weekNumber: currentWeekNum } },
            include: { problem: true },
            take: 2,
        });

        return curriculumProblems.map(cp => new Problem({
            ...cp.problem,
            weekNumber: currentWeekNum
        }));
    }

    async getCompletedProblemIds(userId: string): Promise<string[]> {
        const completions = await this.prisma.userProblem.findMany({
            where: { userId },
            select: { problemId: true },
        });
        return completions.map(c => c.problemId);
    }

    async getCompletedUserProblems(userId: string): Promise<{ problemId: string, completedAt: Date }[]> {
        return this.prisma.userProblem.findMany({
            where: { userId },
            select: { problemId: true, completedAt: true },
        });
    }

    async recordCompletion(userId: string, problemId: string): Promise<void> {
        await this.prisma.userProblem.create({
            data: {
                userId,
                problemId,
                completedAt: new Date(),
            },
        });
    }

    async getBonusProblems(excludeIds: string[], category: string): Promise<Problem[]> {
        let records = await this.prisma.problem.findMany({
            where: {
                id: { notIn: excludeIds },
                category: category,
            },
            take: 20,
            orderBy: { difficulty: 'asc' },
        });

        if (records.length === 0) {
            records = await this.prisma.problem.findMany({
                where: { id: { notIn: excludeIds } },
                take: 20,
            });
        }

        return records.map(p => new Problem({ ...p }));
    }
}

