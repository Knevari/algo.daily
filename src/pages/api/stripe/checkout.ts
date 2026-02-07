import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { Registry } from "@/infrastructure/Registry";
import { InitiateCheckoutUseCase } from "@/core/application/use-cases/InitiateCheckoutUseCase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { planType } = req.body; // "monthly" or "lifetime"

    if (!planType) {
        return res.status(400).json({ success: false, message: "Plan type required" });
    }

    try {
        const userRepository = Registry.getUserRepository();
        const paymentGateway = Registry.getPaymentGateway();

        const useCase = new InitiateCheckoutUseCase(
            userRepository,
            paymentGateway
        );

        const result = await useCase.execute({
            userId: session.user.id,
            email: session.user.email || "",
            planType
        });

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json({ url: result.url });

    } catch (error: any) {
        console.error("Checkout API error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

