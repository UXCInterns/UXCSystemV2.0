// app/api/projects/[id]/team/route.js
import { supabaseAdmin } from '../../../supabaseAdmin';

// Add team member to project
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { profile_id, team_type } = body; // team_type: 'core' or 'support'

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

    const tableName =
      team_type === 'core' ? 'project_core_team' : 'project_support_team';

    // Add team member
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert({
        project_id: params.id,
        profile_id: profile_id,
      })
      .select()
      .single();

    if (error) {
      // Check if already exists
      if (error.code === '23505') {
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

      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to add team member',
          details: error.message,
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
        data,
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

// Remove team member from project
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const profile_id = searchParams.get('profile_id');
    const team_type = searchParams.get('team_type'); // 'core' or 'support'

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

    const tableName =
      team_type === 'core' ? 'project_core_team' : 'project_support_team';

    // Remove team member
    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq('project_id', params.id)
      .eq('profile_id', profile_id);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to remove team member',
          details: error.message,
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
