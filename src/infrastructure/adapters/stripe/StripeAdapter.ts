import Stripe from "stripe";
import type { IPaymentGateway } from "../../../core/application/ports/OutboundPorts";

export class StripeAdapter implements IPaymentGateway {
    private stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: "2026-01-28.clover",
        });
    }

    async createCheckoutSession(userId: string, email: string, planType: string): Promise<string> {
        const isLifetime = planType === "lifetime";
        const priceId = isLifetime
            ? process.env.STRIPE_LIFETIME_PRICE_ID
            : process.env.STRIPE_MONTHLY_PRICE_ID;

        if (!priceId) {
            return `${process.env.NEXTAUTH_URL}/?mock_success=true&plan=${planType}`;
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: isLifetime ? "payment" : "subscription",
            success_url: `${process.env.NEXTAUTH_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/curriculum`,
            client_reference_id: userId,
            customer_email: email,
            metadata: { userId, planType }
        });

        return session.url!;
    }
}

