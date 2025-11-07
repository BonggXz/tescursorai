import "server-only";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { type DefaultSession, type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { getRequestFingerprint, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation/auth";

export type AppSession = DefaultSession & {
  user: {
    id: string;
    role: "USER" | "ADMIN";
    email: string;
    name?: string | null;
  };
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: "UNAUTHORIZED" | "FORBIDDEN",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (req) {
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers ?? {})) {
            if (Array.isArray(value)) {
              headers.append(key, value.join(", "));
            } else if (typeof value === "string") {
              headers.append(key, value);
            }
          }
          const requestClone = new Request("https://auth.local", { headers });
          const rateKey = `login:${getRequestFingerprint(requestClone)}`;
          const loginLimit = Number(process.env.LOGIN_RATE_LIMIT ?? "20");
          const loginWindow = Number(process.env.LOGIN_RATE_WINDOW_MS ?? "60000") || 60_000;
          const rateState = rateLimit({
            uniqueToken: rateKey,
            limit: loginLimit,
            windowMs: loginWindow,
          });

          if (!rateState.success) {
            throw new Error("Too many login attempts. Please try again in a moment.");
          }
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = (user?.id ?? token.sub) as string;
        session.user.role = (user?.role ?? token.role ?? "USER") as "USER" | "ADMIN";
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      await prisma.auditEvent.create({
        data: {
          actorId: user.id,
          entity: "Auth",
          entityId: user.id,
          action: "SIGN_IN",
        },
      });
    },
  },
};

export function getServerAuthSession(): Promise<AppSession | null> {
  return getServerSession(authOptions) as Promise<AppSession | null>;
}

export async function getCurrentUser() {
  const session = await getServerAuthSession();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("You must be signed in.", "UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new AuthError("You are not authorized to access this resource.", "FORBIDDEN");
  }
  return user;
}
