import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { GetServerSidePropsContext } from "next";

export async function getSession(ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) {
    return await getServerSession(ctx.req, ctx.res, authOptions);
}

export async function getCurrentUser(ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) {
    const session = await getSession(ctx);
    return session?.user;
}
