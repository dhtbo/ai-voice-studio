import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { Polar } from "@polar-sh/sdk";

import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { env } from "~/env";
import { db } from "~/server/db";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "e6350397-1d95-4540-bbb4-6ab6a8cd0280",
              slug: "small",
            },
            {
              productId: "fbe743cc-075a-4dce-9611-303ac8478fe9",
              slug: "medium",
            },
            {
              productId: "a3218aed-b3fe-41ca-b248-38115794bb7c",
              slug: "large",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            try {
              const externalCustomerId = order.data.customer.externalId ?? "";
              const email = order.data.customer.email ?? "";
              const productId = order.data.productId;
              let creditsToAdd = 0;
              switch (productId) {
                case "e6350397-1d95-4540-bbb4-6ab6a8cd0280":
                  creditsToAdd = 50;
                  break;
                case "fbe743cc-075a-4dce-9611-303ac8478fe9":
                  creditsToAdd = 200;
                  break;
                case "a3218aed-b3fe-41ca-b248-38115794bb7c":
                  creditsToAdd = 400;
                  break;
              }
              if (!creditsToAdd) {
                console.warn("No matching productId for order", productId);
                return;
              }
              let targetUserId: string | null = null;
              if (externalCustomerId) {
                const userById = await db.user.findUnique({
                  where: { id: externalCustomerId },
                  select: { id: true },
                });
                if (userById) targetUserId = userById.id;
              }
              if (!targetUserId && email) {
                const userByEmail = await db.user.findUnique({
                  where: { email },
                  select: { id: true },
                });
                if (userByEmail) targetUserId = userByEmail.id;
              }
              if (!targetUserId) {
                console.error("User not found for order", {
                  externalCustomerId,
                  email,
                });
                return;
              }
              await db.user.update({
                where: { id: targetUserId },
                data: { credits: { increment: creditsToAdd } },
              });
              console.info("Credits updated for user", {
                userId: targetUserId,
                creditsToAdd,
              });
            } catch (err) {
              console.error("Failed handling onOrderPaid", err);
            }
          },
        }),
      ],
    }),
  ],
});
