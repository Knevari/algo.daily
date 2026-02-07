import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";
import { validateLeetCodeUsername } from "@/lib/leetcode";

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

    const { username } = req.body;

    if (!username || typeof username !== "string") {
        return res.status(400).json({ success: false, message: "Username required" });
    }

    const trimmedUsername = username.trim();

    // Validate that the username exists on LeetCode
    const isValid = await validateLeetCodeUsername(trimmedUsername);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: "LeetCode username not found or profile is private",
        });
    }

    // Save to database
    await db.user.update({
        where: { id: session.user.id },
        data: { leetcodeUsername: trimmedUsername },
    });

    return res.status(200).json({ success: true, message: "LeetCode account connected!" });
}
