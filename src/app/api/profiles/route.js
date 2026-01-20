import { supabaseAdmin } from '../supabaseAdmin';

// GET all profiles or a specific profile
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id'); // Get specific profile by ID

    // If ID is provided, get single profile with all fields
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return new Response(
          JSON.stringify({
            error: 'Failed to fetch profile',
            details: error.message,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ profile: data }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Otherwise, get all profiles with all fields
    let query = supabaseAdmin
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    // Apply search filter if provided
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
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

// PATCH/PUT - Update a profile
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Profile ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Remove fields that shouldn't be updated via API
    delete updates.created_at;
    // updated_at is handled by trigger

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to update profile',
          details: error.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ profile: data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('PATCH handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Support PUT as well (alias for PATCH)
export async function PUT(request) {
  return PATCH(request);
}

// DELETE - Delete a profile AND the auth user (complete account deletion)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Profile ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 1: Delete the profile from profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      return new Response(
        JSON.stringify({
          error: 'Failed to delete profile',
          details: profileError.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 2: Delete the auth user (this requires service role key)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      // Profile is already deleted, but auth deletion failed
      return new Response(
        JSON.stringify({
          error: 'Profile deleted but failed to delete authentication',
          details: authError.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Account deleted successfully',
        deleted: true 
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('DELETE handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}