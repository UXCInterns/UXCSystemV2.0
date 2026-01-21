// app/api/projects/[id]/route.js
import { supabaseAdmin } from '../../supabaseAdmin';

// Helper to get user from auth header
async function _getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user;
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('🔍 GET: Fetching project with ID:', id);
    
    // Fetch project with all related data - EXACTLY like your PATCH
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        project_manager:profiles!project_manager_id(id, full_name, email, avatar_url),
        project_lead:profiles!project_lead_id(id, full_name, email, avatar_url),
        core_team:project_core_team(
          profile:profiles(id, full_name, email, avatar_url)
        ),
        support_team:project_support_team(
          profile:profiles(id, full_name, email, avatar_url)
        )
      `)
      .eq('project_id', id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Project not found', details: error.message }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('📊 Raw project data:', project);
    console.log('👤 Project manager:', project.project_manager);
    console.log('👥 Core team:', project.core_team);

    // Transform data for component - EXACTLY like your PATCH
    const transformed = {
      id: project.project_id,
      project_name: project.project_name,
      project_description: project.project_description || 'No description provided.',
      project_manager: project.project_manager
        ? {
            id: project.project_manager.id,
            name: project.project_manager.full_name,
            email: project.project_manager.email,
            avatar_url: project.project_manager.avatar_url,
          }
        : {
            id: null,
            name: 'Unassigned',
            email: '',
            avatar_url: null,
          },
      project_lead: project.project_lead
        ? {
            id: project.project_lead.id,
            name: project.project_lead.full_name,
            email: project.project_lead.email,
            avatar_url: project.project_lead.avatar_url,
          }
        : {
            id: null,
            name: 'Unassigned',
            email: '',
            avatar_url: null,
          },
      core_team:
        project.core_team?.map((ct) => ({
          id: ct.profile.id,
          name: ct.profile.full_name,
          email: ct.profile.email,
          avatar_url: ct.profile.avatar_url,
        })) || [],
      support_team:
        project.support_team?.map((st) => ({
          id: st.profile.id,
          name: st.profile.full_name,
          email: st.profile.email,
          avatar_url: st.profile.avatar_url,
        })) || [],
      start_date: project.start_date
        ? new Date(project.start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Not set',
      end_date: project.end_date
        ? new Date(project.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Ongoing',
      progress: parseFloat(project.progress) || 0,
      status: project.status || 'Not Started',
      notes: project.notes || 'No notes yet.',
      created_at: project.created_at,
      updated_at: project.updated_at,
    };

    console.log('✅ Transformed project:', transformed);

    return new Response(JSON.stringify(transformed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ GET handler error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch project' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      project_name,
      project_description,
      project_manager_id,
      project_lead_id,
      start_date,
      end_date,
      notes,
      _current_user_id, // ✅ Get user ID from request
    } = body;

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
    const { error: rpcError } = await supabaseAdmin.rpc('update_project_with_user', {
      p_project_id: id,
      p_project_name: project_name,
      p_project_description: project_description,
      p_project_manager_id: project_manager_id,
      p_project_lead_id: project_lead_id,
      p_start_date: start_date,
      p_end_date: end_date,
      p_notes: notes,
      p_user_id: _current_user_id
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return new Response(
        JSON.stringify({
          error: 'Failed to update project',
          details: rpcError.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch updated project with relations
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        project_manager:profiles!project_manager_id(id, full_name, email, avatar_url),
        project_lead:profiles!project_lead_id(id, full_name, email, avatar_url),
        core_team:project_core_team(
          profile:profiles(id, full_name, email, avatar_url)
        ),
        support_team:project_support_team(
          profile:profiles(id, full_name, email, avatar_url)
        )
      `)
      .eq('project_id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch updated project',
          details: error.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Transform data for component
    const transformed = {
      id: project.project_id,
      project_name: project.project_name,
      project_description: project.project_description || 'No description provided.',
      project_manager: project.project_manager
        ? {
            id: project.project_manager.id,
            name: project.project_manager.full_name,
            email: project.project_manager.email,
            avatar_url: project.project_manager.avatar_url,
          }
        : {
            id: null,
            name: 'Unassigned',
            email: '',
            avatar_url: null,
          },
      project_lead: project.project_lead
        ? {
            id: project.project_lead.id,
            name: project.project_lead.full_name,
            email: project.project_lead.email,
            avatar_url: project.project_lead.avatar_url,
          }
        : {
            id: null,
            name: 'Unassigned',
            email: '',
            avatar_url: null,
          },
      core_team:
        project.core_team?.map((ct) => ({
          id: ct.profile.id,
          name: ct.profile.full_name,
          email: ct.profile.email,
          avatar_url: ct.profile.avatar_url,
        })) || [],
      support_team:
        project.support_team?.map((st) => ({
          id: st.profile.id,
          name: st.profile.full_name,
          email: st.profile.email,
          avatar_url: st.profile.avatar_url,
        })) || [],
      start_date: project.start_date
        ? new Date(project.start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Not set',
      end_date: project.end_date
        ? new Date(project.end_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Ongoing',
      progress: parseFloat(project.progress) || 0,
      status: project.status || 'Not Started',
      notes: project.notes || 'No notes yet.',
      created_at: project.created_at,
      updated_at: project.updated_at,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Project updated successfully',
        ...transformed,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('PATCH handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const _current_user_id = searchParams.get('_current_user_id');
    
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
    const { error: rpcError } = await supabaseAdmin.rpc('delete_project_with_user', {
      p_project_id: id,
      p_user_id: _current_user_id
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return new Response(
        JSON.stringify({
          error: 'Failed to delete project',
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
        message: 'Project deleted successfully',
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