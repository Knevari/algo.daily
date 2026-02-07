import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
                streak: (user as any).streak,
                xp: (user as any).xp,
                gems: (user as any).gems,
                leetcodeUsername: (user as any).leetcodeUsername,
            },
        }),
    },
    pages: {
        signIn: "/auth/signin",
    },
};

export default NextAuth(authOptions);
