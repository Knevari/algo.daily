import { PrismaClient } from "@prisma/client";
import type { ICurriculumRepository } from "../../../core/application/ports/OutboundPorts";
import { CurriculumWeek } from "../../../core/domain/CurriculumWeek";
import { Problem } from "../../../core/domain/Problem";

export class PrismaCurriculumRepository implements ICurriculumRepository {
    constructor(private prisma: PrismaClient) { }

    async getWeek(weekNumber: number): Promise<CurriculumWeek | null> {
        const week = await this.prisma.curriculumWeek.findUnique({
            where: { weekNumber },
            include: {
                problems: {
                    include: { problem: true },
                },
            },
        });

        if (!week) return null;

        return new CurriculumWeek({
            id: week.id,
            weekNumber: week.weekNumber,
            title: week.title,
            description: week.description,
            category: week.category,
            problems: week.problems.map(p => ({
                problem: new Problem({
                    ...p.problem,
                    weekNumber: week.weekNumber
                }),
                dayNumber: p.dayNumber,
                order: p.order,
            })),
        });
    }

    async getAllWeeks(): Promise<CurriculumWeek[]> {
        const weeks = await this.prisma.curriculumWeek.findMany({
            include: {
                problems: {
                    include: { problem: true },
                },
            },
            orderBy: { weekNumber: 'asc' },
        });

        return weeks.map(week => new CurriculumWeek({
            id: week.id,
            weekNumber: week.weekNumber,
            title: week.title,
            description: week.description,
            category: week.category,
            problems: week.problems.map(p => ({
                problem: new Problem({
                    ...p.problem,
                    weekNumber: week.weekNumber
                }),
                dayNumber: p.dayNumber,
                order: p.order,
            })),
        }));
    }

    async getCurrentWeek(userId: string): Promise<number> {
        const progress = await this.prisma.userCurriculumProgress.findUnique({
            where: { userId },
        });
        return progress?.currentWeek || 1;
    }

    async saveUserProgress(userId: string, weekNumber: number): Promise<void> {
        await this.prisma.userCurriculumProgress.upsert({
            where: { userId },
            create: {
                userId,
                currentWeek: weekNumber,
            },
            update: {
                currentWeek: weekNumber,
            },
        });
    }

    async getDailyProblems(weekNumber: number, dayNumber: number): Promise<Problem[]> {
        const curriculumProblems = await this.prisma.curriculumProblem.findMany({
            where: {
                week: { weekNumber },
                dayNumber,
            },
            include: {
                problem: true,
                week: true,
            },
            orderBy: { order: "asc" },
        });

        return curriculumProblems.map(cp => new Problem({
            ...cp.problem,
            weekNumber: cp.week.weekNumber,
            // Assuming category falls back to problem category if week doesn't override, or similar logic
            category: cp.week.category || cp.problem.category
        }));
    }
}

