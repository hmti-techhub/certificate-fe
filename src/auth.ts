import NextAuth from "next-auth";
import { IJWTPayload } from "@/lib/types/User";
import { IAuthResponse, ISignInResponseData } from "@/lib/types/Auth";
import Credentials from "next-auth/providers/credentials";
import { signInFormSchema } from "@/lib/types/General";
import jwt from "jsonwebtoken";

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = signInFormSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;
        try {
          const response = await fetch(
            `${process.env.FRONTEND_URL}/api/auth/sign-in`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            },
          );
          if (!response.ok) {
            return null;
          }
          const data: IAuthResponse<ISignInResponseData> =
            await response.json();
          if (!data.success || data.status === 400 || data.status === 401) {
            return null;
          }
          // Decode JWT
          try {
            const userData = jwt.verify(
              data.data?.token as string,
              process.env.JWT_SECRET as string,
            ) as IJWTPayload;

            return {
              id: userData.idUser,
              email: userData.email,
              isPremium: userData.isPremium,
              premiumPackage: userData.premiumPackage,
              roles: userData.roles,
              isVerifiedEmail: userData.isVerifiedEmail,
              token: data.data?.token,
            };
          } catch (decodeError) {
            console.error("JWT Decode Error:", decodeError);
            return null;
          }
        } catch (error) {
          console.error("Authorization Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Saat sign in
        token = {
          ...token,
          ...user,
          email: user.email ?? "",
          isVerifiedEmail: user.isVerifiedEmail,
        };
      }

      if (trigger === "update" && session) {
        console.log("update session", session);

        token.email = session.email ?? token.email;
        token.isPremium = session.isPremium ?? token.isPremium;
        token.premiumPackage = session.premiumPackage ?? token.premiumPackage;
        token.isVerifiedEmail =
          session.isVerifiedEmail ?? token.isVerifiedEmail;
        token.roles = session.roles ?? token.roles;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) return session;
      session.user = {
        ...session.user,
        id: token.sub!,
        email: token.email!,
        isPremium: token.isPremium!,
        premiumPackage: token.premiumPackage!,
        isVerifiedEmail: token.isVerifiedEmail!,
        roles: token.roles!,
      };
      session.token = token.token!;

      return session;
    },
    async signIn({ user }) {
      if (!user) return false;

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  logger: {
    error(error: Error) {
      if (error.name === "CredentialsSignin") return;
      console.error(error);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
});
