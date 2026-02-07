import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    // Only allow manual plan updates in non-production environments for development/testing
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ success: false, message: "Manual plan updates are disabled in production. Use Stripe for upgrades." });
    }

    if (!session?.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { plan } = req.body; // "PRO" or "LIFETIME"

    if (!['PRO', 'LIFETIME', 'FREE'].includes(plan)) {
        return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { plan }
        });

        return res.status(200).json({ success: true, plan });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
