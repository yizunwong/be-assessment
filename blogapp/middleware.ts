// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ['/', '/create-blog', '/my-blog'];

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname === '/auth/signin' && session) {
    const url = req.nextUrl.clone();
    url.pathname = '/'; // Redirect to the home page or another appropriate route
    return NextResponse.redirect(url);
  }

  if (protectedRoutes.includes(pathname) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/signin'; // Redirect to the sign-in page
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/create-blog', '/my-blog', '/auth/signin'],
};