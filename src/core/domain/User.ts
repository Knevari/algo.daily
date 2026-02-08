import { Plan, type PlanType } from "./Plan";

export interface UserProps {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    streak: number;
    maxStreak: number;
    streakFreezes: number;
    xp: number;
    gems: number;
    plan: Plan;
    hintCount: number;
    lastHintAt?: Date | null;
    lastStudiedAt?: Date | null;
}

export class User {
    constructor(private props: UserProps) { }

    get id() { return this.props.id; }
    get streak() { return this.props.streak; }
    get xp() { return this.props.xp; }
    get plan() { return this.props.plan; }
    get hintCount() { return this.props.hintCount; }

    // Business Logic
    canRequestHint(): boolean {
        const limit = this.props.plan.getDailyHintLimit();

        // Reset count if it's a new day
        if (this.isHintQuotaResetNeeded()) {
            return true;
        }

        return this.props.hintCount < limit;
    }

    private isHintQuotaResetNeeded(): boolean {
        if (!this.props.lastHintAt) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastHintDate = new Date(this.props.lastHintAt);
        lastHintDate.setHours(0, 0, 0, 0);
        return lastHintDate.getTime() < today.getTime();
    }

    updateStreak(wasActiveYesterday: boolean) {
        if (wasActiveYesterday) {
            this.props.streak += 1;
        } else {
            this.props.streak = 1;
        }
        this.props.maxStreak = Math.max(this.props.streak, this.props.maxStreak);
        this.props.lastStudiedAt = new Date();
    }

    addXp(amount: number) {
        this.props.xp += amount;
    }

    incrementHintCount() {
        if (this.isHintQuotaResetNeeded()) {
            this.props.hintCount = 1;
        } else {
            this.props.hintCount += 1;
        }
        this.props.lastHintAt = new Date();
    }

    // Store Logic
    purchaseStreakFreeze(cost: number, maxFreezes: number): void {
        if (this.props.streakFreezes >= maxFreezes) {
            throw new Error(`You can only hold ${maxFreezes} freezes at a time!`);
        }
        if (this.props.xp < cost) {
            throw new Error(`Not enough XP! Need ${cost} XP.`);
        }
        this.props.xp -= cost;
        this.props.streakFreezes += 1;
    }

    toJSON() {
        return {
            ...this.props,
            plan: this.props.plan.type
        };
    }
}

