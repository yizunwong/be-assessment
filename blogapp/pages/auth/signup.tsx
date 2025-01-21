import { Inter } from 'next/font/google'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

/**
 * Renders a sign up form for users to create a new account.
 *
 * The form includes fields for:
 * - Username
 * - Email address
 * - Password
 *
 * When the form is submitted, a POST request is sent to the signup API endpoint
 * with the provided username, email, and password. If the request is successful, 
 * the user is redirected to the homepage. If an error occurs, it is logged to the console.
 *
 * If the user already has an account, a link to the sign in page is displayed.
 */

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Set content type to JSON
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        })
      })
      .then((res) => {
        if(!res.ok) {
          return Promise.reject();
        }
        console.log('res', res)
      })
      .catch((err) => {
        console.log('err', err);
      });

      router.push('/auth/signin');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="max-w-5xl w-full items-center justify-between font-mono lg:flex">
        <h1 className="text-4xl mb-8">Sign Up</h1>
        <form className="w-full max-w-md" onSubmit={submitForm}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Up
          </button>
          <div className="mt-6">
            <Link href="/auth/signin">
              <span className="text-blue-500 mt-4 cursor-pointer">Already have an account? Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignUp