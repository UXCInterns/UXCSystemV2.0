// app/api/projects/[id]/team/route.js
import { supabaseAdmin } from '../../../supabaseAdmin';

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { profile_id, team_type, _current_user_id } = body;

    if (!profile_id || !team_type) {
      return new Response(
        JSON.stringify({ error: 'Missing profile_id or team_type' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (team_type !== 'core' && team_type !== 'support') {
      return new Response(
        JSON.stringify({ error: 'team_type must be "core" or "support"' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!_current_user_id) {
      return new Response(
        JSON.stringify({ error: 'User authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // ✅ Use wrapper RPC function
    const { error: rpcError } = await supabaseAdmin.rpc('add_team_member_with_user', {
      p_project_id: params.id,
      p_profile_id: profile_id,
      p_team_type: team_type,
      p_user_id: _current_user_id
    });

    if (rpcError) {
      // Check if already exists
      if (rpcError.code === '23505') {
        return new Response(
          JSON.stringify({
            error: 'Team member already assigned to this project',
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      console.error('RPC error:', rpcError);
      return new Response(
        JSON.stringify({
          error: 'Failed to add team member',
          details: rpcError.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Team member added successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('POST handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const profile_id = searchParams.get('profile_id');
    const team_type = searchParams.get('team_type');
    const _current_user_id = searchParams.get('_current_user_id');

    if (!profile_id || !team_type) {
      return new Response(
        JSON.stringify({ error: 'Missing profile_id or team_type' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (team_type !== 'core' && team_type !== 'support') {
      return new Response(
        JSON.stringify({ error: 'team_type must be "core" or "support"' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!_current_user_id) {
      return new Response(
        JSON.stringify({ error: 'User authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // ✅ Use wrapper RPC function
    const { error: rpcError } = await supabaseAdmin.rpc('remove_team_member_with_user', {
      p_project_id: params.id,
      p_profile_id: profile_id,
      p_team_type: team_type,
      p_user_id: _current_user_id
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return new Response(
        JSON.stringify({
          error: 'Failed to remove team member',
          details: rpcError.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Team member removed successfully',
      }),
      {
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