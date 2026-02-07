import type { IUserRepository, IPaymentGateway } from "../ports/OutboundPorts";

export interface InitiateCheckoutInput {
    userId: string;
    email: string;
    planType: string;
}

export interface InitiateCheckoutOutput {
    success: boolean;
    url?: string;
    message?: string;
}

export class InitiateCheckoutUseCase {
    constructor(
        private userRepository: IUserRepository,
        private paymentGateway: IPaymentGateway
    ) { }

    async execute(input: InitiateCheckoutInput): Promise<InitiateCheckoutOutput> {
        const { userId, email, planType } = input;

        try {
            const checkoutUrl = await this.paymentGateway.createCheckoutSession(userId, email, planType);
            return { success: true, url: checkoutUrl };
        } catch (e: any) {
            return { success: false, message: e.message || "Failed to initiate checkout" };
        }
    }
}

