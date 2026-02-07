import type { IUserRepository, IProblemRepository, ICurriculumRepository } from "../ports/OutboundPorts";

export interface GetDashboardInput {
    userId: string;
}

export interface DashboardProblemDTO {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    category: string;
    externalUrl: string;
}

export interface GetDashboardOutput {
    user: any;
    todaysProblems: DashboardProblemDTO[];
    completedProblemIds: string[];
    curriculum: any;
    leaderboard: any[];
    isDailyGoalComplete: boolean;
}

export class GetDashboardUseCase {
    constructor(
        private userRepository: IUserRepository,
        private problemRepository: IProblemRepository,
        private curriculumRepository: ICurriculumRepository
    ) { }

    async execute(input: GetDashboardInput): Promise<GetDashboardOutput> {
        const { userId } = input;

        const user = await this.userRepository.findById(userId);
        const userData = user ? user.toJSON() : null;

        const todaysProblems = await this.problemRepository.findTodaysProblems(userId);
        const completedProblemIds = await this.problemRepository.getCompletedProblemIds(userId);
        const leaderboard = await this.userRepository.getLeaderboard();

        const currentWeekNum = await this.curriculumRepository.getCurrentWeek(userId);
        const week = await this.curriculumRepository.getWeek(currentWeekNum);

        const todaysCompletedCount = todaysProblems.filter(p => completedProblemIds.includes(p.id)).length;
        const isDailyGoalComplete = todaysCompletedCount >= 2;

        return {
            user: userData,
            todaysProblems: todaysProblems.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.getProperties().difficulty,
                category: p.getProperties().category,
                externalUrl: p.getProperties().externalUrl
            })),
            completedProblemIds,
            curriculum: week ? {
                currentWeek: week.weekNumber,
                weekTitle: week.title,
            } : null,
            leaderboard,
            isDailyGoalComplete
        };
    }
}

