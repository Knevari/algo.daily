import type { IUserRepository, IProblemRepository, IAIService } from "../ports/OutboundPorts";

export interface RequestHintInput {
    userId: string;
    slug: string;
    code: string;
    language: string;
    hintLevel: number;
}

export interface RequestHintOutput {
    success: boolean;
    hint?: string;
    hintLevel?: number;
    message?: string;
    limitReached?: boolean;
}

export class RequestHintUseCase {
    constructor(
        private userRepository: IUserRepository,
        private problemRepository: IProblemRepository,
        private aiService: IAIService
    ) { }

    async execute(input: RequestHintInput): Promise<RequestHintOutput> {
        const { userId, slug, code, language, hintLevel } = input;

        const user = await this.userRepository.findById(userId);
        if (!user) return { success: false, message: "User not found" };

        if (!user.canRequestHint()) {
            return {
                success: false,
                message: "Daily hint limit reached! Upgrade to AlgoDaily Pro for unlimited hints.",
                limitReached: true
            };
        }

        try {
            const hint = await this.aiService.generateHint(slug, code, language, hintLevel);

            user.incrementHintCount();
            await this.userRepository.save(user);

            return {
                success: true,
                hint,
                hintLevel: hintLevel + 1
            };
        } catch (e) {
            return { success: false, message: "Failed to generate hint" };
        }
    }
}

