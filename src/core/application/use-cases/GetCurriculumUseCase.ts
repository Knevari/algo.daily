import type { ICurriculumRepository, IUserRepository, IProblemRepository } from "../ports/OutboundPorts";

export interface GetCurriculumInput {
    userId?: string;
}

export interface CurriculumProblemDTO {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    dayNumber: number;
    order: number;
    isCompleted: boolean;
    externalUrl: string;
}

export interface CurriculumWeekDTO {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    category: string;
    totalProblems: number;
    completedProblems: number;
    isLocked: boolean;
    problems: CurriculumProblemDTO[];
}

export interface GetCurriculumOutput {
    weeks: CurriculumWeekDTO[];
    currentWeek: number;
    isAuthenticated: boolean;
    userPlan: string;
}

export class GetCurriculumUseCase {
    constructor(
        private curriculumRepository: ICurriculumRepository,
        private problemRepository: IProblemRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(input: GetCurriculumInput): Promise<GetCurriculumOutput> {
        const { userId } = input;
        let isPro = false;
        let completedProblemIds: string[] = [];
        let currentWeek = 1;
        let userPlan = "FREE";

        if (userId) {
            const user = await this.userRepository.findById(userId);
            if (user) {
                userPlan = user.plan.type;
                isPro = userPlan === "PRO" || userPlan === "LIFETIME";
                completedProblemIds = await this.problemRepository.getCompletedProblemIds(userId);
                currentWeek = await this.curriculumRepository.getCurrentWeek(userId);
            }
        }

        const weeks = await this.curriculumRepository.getAllWeeks();

        const formattedWeeks: CurriculumWeekDTO[] = weeks.map(week => {
            const isLocked = week.isGated(isPro);

            return {
                id: week.id,
                weekNumber: week.weekNumber,
                title: week.title,
                description: isLocked ? this.obfuscate(week.description) : week.description,
                category: week.category,
                totalProblems: week.problems.length,
                completedProblems: week.problems.filter(p =>
                    completedProblemIds.includes(p.problem.id)
                ).length,
                isLocked,
                problems: week.problems.map(p => ({
                    id: p.problem.id,
                    title: p.problem.title,
                    slug: p.problem.slug,
                    difficulty: p.problem.getProperties().difficulty,
                    dayNumber: p.dayNumber,
                    order: p.order,
                    isCompleted: completedProblemIds.includes(p.problem.id),
                    externalUrl: p.problem.getProperties().externalUrl,
                })),
            };
        });

        return {
            weeks: formattedWeeks,
            currentWeek,
            isAuthenticated: !!userId,
            userPlan
        };
    }

    private obfuscate(text: string): string {
        const plainText = text.replace(/<[^>]*>?/gm, '');
        return plainText.split(' ').map(word => {
            if (word.length <= 3) return ".".repeat(word.length);
            const first = word[0];
            const last = word[word.length - 1];
            let result = first || "";
            for (let i = 1; i < word.length - 1; i++) {
                result += ".";
            }
            result += last || "";
            return result;
        }).join(' ');
    }
}
