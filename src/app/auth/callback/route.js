// app/auth/callback/route.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // ✅ Use environment variable for redirects
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  // If there's an OAuth error, redirect to signin with error
  if (error) {
    console.error('❌ OAuth error:', error, error_description);
    return NextResponse.redirect(
      `${siteUrl}/signin?error=${encodeURIComponent(error_description || error)}`
    );
  }

  // If we have a code, exchange it for a session
  if (code) {
    try {
      const cookieStore = await cookies();
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      );
      
      console.log('🔄 Exchanging code for session...');
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('❌ Error exchanging code:', exchangeError);
        return NextResponse.redirect(
          `${siteUrl}/signin?error=${encodeURIComponent('Authentication failed')}`
        );
      }

      console.log('✅ Session established for:', data.user?.email);
      
      // ✅ Redirect to home using site URL
      return NextResponse.redirect(`${siteUrl}/home`);
    } catch (err) {
      console.error('❌ Unexpected error in callback:', err);
      return NextResponse.redirect(
        `${siteUrl}/signin?error=${encodeURIComponent('Something went wrong')}`
      );
    }
  }

  // No code and no error - shouldn't happen, but redirect to signin
  console.warn('⚠️ Callback hit without code or error');
  return NextResponse.redirect(`${siteUrl}/signin`);
}