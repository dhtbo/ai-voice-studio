import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// 如果您的 Prisma 文件位于其他位置，可以更改路径
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // 或 "mysql", "postgresql", ...等
    }),
    emailAndPassword: {
        enabled: true, 
    },
});