import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { connectToDB } from "./lib/utils";
import { Admin } from "./lib/models";

const login = async (credentials) => {
  try {
    connectToDB();
    const user = await Admin.findOne({ email: credentials.email }).lean();
    if (!user.isAdmin) throw new Error("You are not admin");
    if (
      credentials.email !== user?.email ||
      credentials.password !== user.password
    ) {
      throw new Error("Wrong credentials!");
    }
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to login!");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
