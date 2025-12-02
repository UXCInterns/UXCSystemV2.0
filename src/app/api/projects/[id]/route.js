// app/api/projects/[id]/route.js
import { supabaseAdmin } from '../../supabaseAdmin';

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
      // progress,
      // status,
      notes,
    } = body;

    // Build update object with only provided fields
    const updateData = {};
    if (project_name !== undefined) updateData.project_name = project_name;
    if (project_description !== undefined) updateData.project_description = project_description;
    if (project_manager_id !== undefined) updateData.project_manager_id = project_manager_id;
    if (project_lead_id !== undefined) updateData.project_lead_id = project_lead_id;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    // if (progress !== undefined) updateData.progress = progress;
    // if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = new Date().toISOString();

    // Update project
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('project_id', id)
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
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to update project',
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
    
    // Delete related team members first (if cascade is not set)
    await supabaseAdmin
      .from('project_core_team')
      .delete()
      .eq('project_id', id);

    await supabaseAdmin
      .from('project_support_team')
      .delete()
      .eq('project_id', id);

    // Delete the project
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('project_id', id);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to delete project',
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