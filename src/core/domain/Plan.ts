export type PlanType = "FREE" | "PRO" | "LIFETIME";

export class Plan {
    constructor(public readonly type: PlanType) { }

    isPro(): boolean {
        return this.type === "PRO" || this.type === "LIFETIME";
    }

    isLifetime(): boolean {
        return this.type === "LIFETIME";
    }

    canAccessWeek(weekNumber: number): boolean {
        // Week 1 is free for everyone
        if (weekNumber === 1) return true;
        return this.isPro();
    }

    getDailyHintLimit(): number {
        return this.isPro() ? Infinity : 3;
    }
}

