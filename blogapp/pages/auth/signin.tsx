import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";

const inter = Inter({ subsets: ["latin"] });

/**
 * Renders a sign in form for users to authenticate with the application.
 *
 * The form will be rendered with a label, input field, and submit button for
 * each of the following fields:
 *
 * - Email address
 * - Password
 *
 * When the form is submitted, the `signIn` function from NextAuth will be
 * called with the `credentials` provider and the email and password from the
 * form. If the authentication is successful, the user will be redirected to
 * the homepage after a 1 second delay.
 *
 * If there is an error with the authentication, an error message will be
 * displayed below the form.
 *
 * If the user doesn't have an account, a link to the sign up page will be
 * displayed below the form.
 */
const SignIn: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      setTimeout(async () => {
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );
        Cookies.set("payload-token", session.user.token, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        router.push("/");
      }, 1000);
    } else {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="max-w-5xl w-full items-center justify-between font-mono lg:flex">
        <h1 className="text-4xl mb-8">Sign In</h1>
        <form className="w-full max-w-md" onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 text-red-500">{error && <p>{error}</p>}</div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            style={{ height: "48px", width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </button>
          <div className="mt-6">
            <Link href="/auth/signup">
              <span className="text-blue-500 mt-4 cursor-pointer">
                Don&apos;t have an account? Sign Up
              </span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignIn;
