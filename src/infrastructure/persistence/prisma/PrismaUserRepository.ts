import { PrismaClient } from "@prisma/client";
import type { IUserRepository } from "../../../core/application/ports/OutboundPorts";
import { User } from "../../../core/domain/User";
import { Plan } from "../../../core/domain/Plan";
import type { PlanType } from "../../../core/domain/Plan";

export class PrismaUserRepository implements IUserRepository {
    constructor(private prisma: PrismaClient) { }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return new User({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            streak: user.streak,
            maxStreak: user.maxStreak,
            xp: user.xp,
            gems: user.gems,
            plan: new Plan(user.plan as PlanType),
            hintCount: user.hintCount,
            lastHintAt: user.lastHintAt,
            lastStudiedAt: user.lastStudiedAt,
        });
    }

    async save(user: User): Promise<void> {
        const data = user.toJSON();
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                streak: data.streak,
                maxStreak: data.maxStreak,
                xp: data.xp,
                gems: data.gems,
                plan: data.plan as any,
                hintCount: data.hintCount,
                lastHintAt: data.lastHintAt,
                lastStudiedAt: data.lastStudiedAt,
            },
        });
    }

    async updateStreak(userId: string, date: Date): Promise<void> {
        const user = await this.findById(userId);
        if (!user) return;

        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);

        const wasActiveYesterday = user.toJSON().lastStudiedAt?.toDateString() === yesterday.toDateString();

        user.updateStreak(wasActiveYesterday);
        await this.save(user);
    }

    async getLeaderboard(): Promise<any[]> {
        return this.prisma.user.findMany({
            orderBy: { xp: 'desc' },
            take: 10,
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
                streak: true,
            },
        });
    }
}

