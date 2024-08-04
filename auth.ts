import { compareSync } from "bcrypt-ts-edge";
import { eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

import db from "./db/drizzle";
import { users } from "./db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const config = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
	adapter: DrizzleAdapter(db),
	providers: [
		CredentialsProvider({
			credentials: {
				phone: {},
				password: { type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				const user = await db.query.users.findFirst({
					where: eq(users.phone, credentials.phone as string),
				});

				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password
					);
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							phone: user.phone,
							image: user.image,
							admin: user.admin,
						};
					}
				}
				return null;
			},
		}),
	],
	callbacks: {
		session: async ({ session, user, trigger, token }: any) => {
			session.user.id = token.sub;
			if (trigger === "update") {
				session.user.name = user.name;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
