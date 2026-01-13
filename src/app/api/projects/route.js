// app/api/projects/route.js
import { supabaseAdmin } from '../supabaseAdmin';

export async function GET() {
  try {
    console.log('🔍 Fetching all projects with avatars...');
    
    // Fetch all projects WITH related profiles data including avatar_url
    const { data, error } = await supabaseAdmin
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
      .order('start_date', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch projects', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Transform data for component - INCLUDING id and avatar_url
    const transformedData = (data || []).map((project) => ({
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
          id: ct.profile?.id,
          name: ct.profile?.full_name,
          email: ct.profile?.email,
          avatar_url: ct.profile?.avatar_url,
        })).filter(member => member.id) || [],
      support_team:
        project.support_team?.map((st) => ({
          id: st.profile?.id,
          name: st.profile?.full_name,
          email: st.profile?.email,
          avatar_url: st.profile?.avatar_url,
        })).filter(member => member.id) || [],
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
    }));

    console.log('✅ Transformed projects:', transformedData.length);
    console.log('📊 Sample project manager:', transformedData[0]?.project_manager);

    return new Response(JSON.stringify({ projects: transformedData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ GET handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      project_name,
      project_description,
      project_manager_id,
      project_lead_id,
      start_date,
      end_date,
      progress,
      status,
      notes,
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!project_name || !project_name.trim()) missingFields.push('Project name');
    if (!start_date) missingFields.push('Start date');
    if (!end_date) missingFields.push('End date');
    if (!project_manager_id) missingFields.push('Project manager');
    if (!project_lead_id) missingFields.push('Project lead');

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `The following fields are required: ${missingFields.join(', ')}` 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert new project
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert([
        {
          project_name: project_name.trim(),
          project_description: project_description || null,
          project_manager_id,
          project_lead_id,
          start_date,
          end_date,
          progress: progress || 0,
          status: status || 'Not Started',
          notes: notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
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
          error: 'Failed to create project',
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
          id: ct.profile?.id,
          name: ct.profile?.full_name,
          email: ct.profile?.email,
          avatar_url: ct.profile?.avatar_url,
        })).filter(member => member.id) || [],
      support_team:
        project.support_team?.map((st) => ({
          id: st.profile?.id,
          name: st.profile?.full_name,
          email: st.profile?.email,
          avatar_url: st.profile?.avatar_url,
        })).filter(member => member.id) || [],
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
        message: 'Project created successfully',
        project: transformed,
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