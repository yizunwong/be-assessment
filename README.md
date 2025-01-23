# be-assessment
# Authentication Setup:
1. Install NextAuth.js
Install the next-auth package using npm or yarn:
npm install next-auth
yarn add next-auth

2. Configure NextAuth.js
Create a [...nextauth].ts file in the pages/api/auth directory.
Configure the authentication providers (e.g., CredentialsProvider for email/password authentication).
Set up environment variables for sensitive data like NEXTAUTH_SECRET and NEXTAUTH_URL.
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

3. Customize Authentication Options
Define custom callbacks for session and jwt to include additional user data in the session.
Configure protected routes and redirects for authenticated and unauthenticated users.

# Authentication Flow:
1. User Login
Users submit their credentials (e.g., email and password) via the login form.
The credentials are sent to the authorize function in the CredentialsProvider.
If the credentials are valid, a session is created, and the user is redirected to the dashboard or home page.

2. Session Management
NextAuth.js manages user sessions using JSON Web Tokens (JWT) or database sessions.
The session callback is used to include additional user data (e.g., user ID, username) in the session object.

3. Protected Routes
Middleware is used to protect routes like /dashboard, /create-blog, and /my-blog.
Unauthenticated users are redirected to the sign-in page.

4. User Logout
Users can log out by calling the signOut function from next-auth/react.
The session is invalidated, and the user is redirected to the sign-in page.


# Frontend:
1. Sign-In Page
A custom sign-in page (/auth/signin) was created to handle user login.
The page includes a form for email and password input and displays error messages for invalid credentials.

2. Protected Routes
Middleware was added to redirect unauthenticated users away from protected routes.
Authenticated users can access protected routes like /dashboard, /create-blog, and /my-blog.

3. User Session in Components
The useSession hook from next-auth/react is used to access the user session in frontend components.
Session data (e.g., username, email) is displayed in the UI.

4. Logout Button
A logout button was added to the navigation bar or user profile page.
Clicking the button calls the signOut function to log the user out.

# Deployment:
1. Environment Variables
Ensure the following environment variables are set in the Vercel project:
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-vercel-app.vercel.app
2. API Endpoints
Verify that all API endpoints (e.g., /api/users/login) are correctly configured and accessible in the production environment.

3. CORS Configuration
If the API is hosted on a different domain, configure CORS to allow requests from the Vercel app.

4. Rebuild and Redeploy
After making changes to the authentication setup, rebuild and redeploy the application on Vercel.
