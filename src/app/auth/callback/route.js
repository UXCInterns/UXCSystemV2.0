// app/auth/callback/route.js
// Simple redirect - let the client-side Supabase handle everything
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  
  // Just preserve all query params and redirect to home
  // The Supabase client will detect the code in the URL and handle it automatically
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // If there's an OAuth error
  if (error) {
    console.error('❌ OAuth error:', error, error_description);
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=${error}`
    );
  }

  if (code) {
    console.log('✅ Auth code received, redirecting to home (client will process)');
    // Redirect to home with the code - Supabase client will auto-detect and exchange it
    return NextResponse.redirect(`${requestUrl.origin}/home?code=${code}`);
  }

  // No code, just go to signin
  return NextResponse.redirect(`${requestUrl.origin}/signin`);
}