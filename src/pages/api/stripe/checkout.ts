import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-01-28.clover",
});

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

    try {
        const isLifetime = planType === "lifetime";

        // Placeholder Price IDs - In a real app, these come from Stripe Dashboard
        const priceId = isLifetime
            ? process.env.STRIPE_LIFETIME_PRICE_ID
            : process.env.STRIPE_MONTHLY_PRICE_ID;

        if (!priceId) {
            // Fallback for development if keys aren't set up yet
            return res.status(200).json({
                success: true,
                message: "Stripe Price IDs not configured. Redirecting to mock success.",
                url: `${process.env.NEXTAUTH_URL}/?mock_success=true&plan=${planType}`
            });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: isLifetime ? "payment" : "subscription",
            success_url: `${process.env.NEXTAUTH_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/curriculum`,
            client_reference_id: session.user.id,
            customer_email: session.user.email || undefined,
            metadata: {
                userId: session.user.id,
                planType: planType
            }
        });

        return res.status(200).json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("Stripe error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
