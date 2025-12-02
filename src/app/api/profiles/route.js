// app/api/profiles/route.js
import { supabaseAdmin } from '../supabaseAdmin';

// GET all profiles (for team member selection)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .order('full_name', { ascending: true });

    // Apply search filter if provided
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch profiles',
          details: error.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ profiles: data || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
