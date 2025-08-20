import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { workspaceType } from "@/db/schema";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    organization({
      schema: {
        organization: {
          additionalFields: {
            description: {
              type: "string",
              required: true,
            },
            type: {
              type: workspaceType.enumValues,
              required: true,
            },
          },
          ac,
          roles,
        },
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type Organization = typeof auth.$Infer.Organization;
