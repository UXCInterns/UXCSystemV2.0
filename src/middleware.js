// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  
  // Allow /home if there's a code parameter (OAuth callback in progress)
  const hasAuthCode = searchParams.has('code');
  
  if (hasAuthCode && pathname === '/home') {
    console.log('✅ Middleware: Auth code detected, allowing access to /home');
    return NextResponse.next();
  }

  // Always allow signin page access
  if (pathname === '/signin') {
    return NextResponse.next();
  }

  // For all other routes, allow through
  // Auth protection happens client-side via AuthContext
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home/:path*',
    '/uxc-dashboard/:path*',
    '/cet-dashboard/:path*',
    '/uxc-attendance/:path*',
    '/cet-attendance/:path*',
    '/project-board/:path*',
    '/manpower/:path*',
    '/profile/:path*',
    '/signin',
  ],
};