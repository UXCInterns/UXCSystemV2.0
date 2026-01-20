// middleware.js
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Always allow public routes
  if (isPublicRoute) {
    console.log('✅ Middleware: Public route, allowing access');
    return res;
  }

  // Check session for protected routes
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session, redirect to signin
    if (!session) {
      console.log('❌ Middleware: No session, redirecting to /signin');
      const redirectUrl = new URL('/signin', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    console.log('✅ Middleware: Session valid for', session.user.email);
    
    // If authenticated and trying to access signin, redirect to home
    if (pathname === '/signin') {
      console.log('🔀 Middleware: Already authenticated, redirecting to /home');
      const redirectUrl = new URL('/home', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error('❌ Middleware error:', error);
    // On error, allow the request to proceed
    // Auth protection will happen client-side
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};