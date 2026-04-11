import { getServerSession, type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/admin-auth";

function getEnv(name: "AUTH_SECRET" | "AUTH_GOOGLE_ID" | "AUTH_GOOGLE_SECRET") {
  return process.env[name];
}

export const authOptions: NextAuthOptions = {
  secret: getEnv("AUTH_SECRET") ?? "dev-auth-secret-change-me",
  providers: [
    Google({
      clientId: getEnv("AUTH_GOOGLE_ID") ?? "missing-google-client-id",
      clientSecret: getEnv("AUTH_GOOGLE_SECRET") ?? "missing-google-client-secret",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      return isAdminEmail(user.email);
    },
  },
  logger: {
    error(code, ...message) {
      if (code === "JWT_SESSION_ERROR") {
        return;
      }

      console.error("[next-auth][error]", code, ...message);
    },
  },
};

export function auth() {
  return getServerSession(authOptions).catch(() => null);
}
