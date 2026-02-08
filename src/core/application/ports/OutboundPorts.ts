import { User } from "../../domain/User";
import { Problem } from "../../domain/Problem";
import { CurriculumWeek } from "../../domain/CurriculumWeek";

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
    updateStreak(userId: string, date: Date): Promise<void>;
    getLeaderboard(limit?: number): Promise<any[]>;
    savePushSubscription(userId: string, subscription: string): Promise<void>;
    removePushSubscription(userId: string): Promise<void>;
}

export interface IProblemRepository {
    findById(id: string): Promise<Problem | null>;
    findBySlug(slug: string): Promise<Problem | null>;
    findTodaysProblems(userId: string): Promise<Problem[]>;
    getCompletedProblemIds(userId: string): Promise<string[]>;
    getCompletedUserProblems(userId: string): Promise<{ problemId: string, completedAt: Date }[]>;
    recordCompletion(userId: string, problemId: string): Promise<void>;
    getBonusProblems(excludeIds: string[], category: string): Promise<Problem[]>;
}

export interface ICurriculumRepository {
    getWeek(weekNumber: number): Promise<CurriculumWeek | null>;
    getAllWeeks(): Promise<CurriculumWeek[]>;
    getCurrentWeek(userId: string): Promise<number>;
    saveUserProgress(userId: string, weekNumber: number): Promise<void>;
    getDailyProblems(weekNumber: number, dayNumber: number): Promise<Problem[]>;
}

export interface IPaymentGateway {
    createCheckoutSession(userId: string, email: string, planType: string): Promise<string>;
}

export interface ICodeExecutionService {
    execute(language: string, code: string, testCases: any[]): Promise<any>;
}

export interface IAIService {
    generateHint(slug: string, code: string, language: string, level: number): Promise<string>;
}

