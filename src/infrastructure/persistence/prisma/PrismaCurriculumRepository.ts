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
}

