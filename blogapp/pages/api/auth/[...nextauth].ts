import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { User } from "@/models/user";
import { connectToDatabase } from "@/utils/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await connectToDatabase();
        const user = await db
          .collection<User>("users")
          .findOne({ email: credentials?.email.trim() });

        console.log(user);

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Return all necessary fields
        return {
          id: user._id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      // Add user data from the token to the session
      if (token) {
        session.user = {
          _id: token.sub as string,
          username: token.name as string,
          email: token.email as string,
        } as User;
      }
      console.log("Session:", session); // Debugging: Log the token

      return session;
    },
    async jwt({ token }: { token: JWT }, user?: User): Promise<JWT> {
      if (user) {
        token.sub = user._id;
        token.name = user.username;
        token.email = user.email;
      }
      console.log("JWT Token:", token); // Debugging: Log the token

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
