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

    if (!session?.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { weekNumber } = req.body;

    if (typeof weekNumber !== "number" || weekNumber < 1 || weekNumber > 12) {
        return res.status(400).json({ success: false, message: "Invalid week number" });
    }

    await db.userCurriculumProgress.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            currentWeek: weekNumber,
        },
        update: {
            currentWeek: weekNumber,
        },
    });

    return res.status(200).json({ success: true });
}
