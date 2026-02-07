import type { IUserRepository, IProblemRepository, ICurriculumRepository } from "../ports/OutboundPorts";

export interface GetProblemInput {
    userId?: string;
    slug: string;
}

export interface GetProblemOutput {
    problem: {
        id: string;
        title: string;
        slug: string;
        difficulty: string;
        category: string;
        description: string;
        starterCode: any;
        testCases: any[];
        externalUrl: string;
    } | null;
    isLocked: boolean;
    user: {
        name: string | null;
        image: string | null;
        plan: string;
    } | null;
    redirect?: string;
}

export class GetProblemUseCase {
    constructor(
        private userRepository: IUserRepository,
        private problemRepository: IProblemRepository,
        private curriculumRepository: ICurriculumRepository // To check week number for locking
    ) { }

    async execute(input: GetProblemInput): Promise<GetProblemOutput> {
        const { userId, slug } = input;
        let isPro = false;
        let userPlan = "FREE";
        let user = null;

        if (userId) {
            const foundUser = await this.userRepository.findById(userId);
            if (foundUser) {
                user = {
                    name: foundUser.toJSON().name || null,
                    image: foundUser.toJSON().image || null,
                    plan: foundUser.plan.type
                };
                userPlan = foundUser.plan.type;
                isPro = userPlan === "PRO" || userPlan === "LIFETIME";
            }
        }

        const problem = await this.problemRepository.findBySlug(slug);

        if (!problem) {
            return {
                problem: null,
                isLocked: false,
                user: user
            };
        }

        // Determine if problem is locked based on the week it belongs to
        // Current Problem entity has weekNumber, which simplifies things.
        // If not, we'd need to query curriculum repository to find which week the problem is in.
        // Let's assume Problem entity has weekNumber populated. 
        // If not, we might need a method on IProblemRepository or ICurriculumRepository to get it.
        // Checked Problem.ts: it has weekNumber in props and getter.

        const weekNumber = problem.weekNumber || 1; // Default to 1 if undefined (shouldn't happen in curriculum context)
        const isLocked = !isPro && weekNumber > 1;

        const gatedContent = problem.getGatedContent(isPro);

        let parsedStarterCode = {};
        let parsedTestCases = [];

        try {
            parsedStarterCode = JSON.parse(gatedContent.starterCode || "{}");
            parsedTestCases = JSON.parse(gatedContent.testCases || "[]");
        } catch (e) {
            console.error("Failed to parse problem JSON data", e);
        }

        return {
            problem: {
                id: problem.id,
                title: problem.title,
                slug: problem.slug,
                difficulty: problem.getProperties().difficulty,
                category: problem.getProperties().category,
                description: gatedContent.description,
                starterCode: parsedStarterCode,
                testCases: parsedTestCases,
                externalUrl: problem.getProperties().externalUrl,
            },
            isLocked,
            user
        };
    }
}
