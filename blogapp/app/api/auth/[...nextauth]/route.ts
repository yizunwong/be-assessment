import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { User } from "@/models/user";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * This function is called when a user submits their credentials to the login
       * form. It sends a POST request to the `/api/users/login` endpoint with the
       * provided credentials and expects a JSON response with the user's id,
       * name, email, and token.
       *
       * If the response is not OK, it throws an error with the message
       * "Invalid email or password".
       *
       * Otherwise, it returns an object with the user's id, name, email, and token.
       */
      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email.trim(),
            password: credentials?.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid email or password");
        }

        const { user, token } = await response.json();

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          token,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    /**
     * This callback is called whenever a session is checked. It receives the
     * current session and the user's token as arguments. If the token is valid,
     * it adds the user's id, name, email, and token to the session object.
     *
     * @param {Object} session The session object to be returned to the client
     * @param {Object} token The user's token, which contains the user's id, name,
     * email, and token
     * @return {Object} The session object with the user's data
     */
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token.sub as string,
          username: token.name as string,
          email: token.email as string,
          token: token.token as string,
        } as User;
      }
      return session;
    },
/**
 * This callback is triggered whenever a JSON Web Token (JWT) is created or updated.
 * It receives the current token and the user object as arguments. If the user object
 * is present, it adds the user's id, name, email, and token to the JWT.
 *
 * @param {Object} token The current token object which may be modified
 * @param {Object} user The user object, containing user details like id, name, email, and token
 * @return {Object} The modified token object including user details
 */

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        if ("token" in user) {
          token.token = user.token;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
