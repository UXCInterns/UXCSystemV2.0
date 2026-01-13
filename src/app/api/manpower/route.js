// app/api/manpower/route.js
import { supabaseAdmin } from '../supabaseAdmin';

export async function GET() {
  try {
    console.log('🔍 Fetching manpower allocation data...');
    
    // Fetch manpower allocation data from the view
    const { data: manpower, error } = await supabaseAdmin
      .from('manpower_allocation')
      .select('*')
      .order('total_projects', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch manpower data', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Fetched manpower data:', manpower?.length || 0, 'people');

    // Return the manpower data
    return new Response(
      JSON.stringify({
        manpower: manpower || [],
        count: manpower?.length || 0,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
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

// Optional: POST endpoint for a specific person's workload details
export async function POST(request) {
  try {
    const { profile_id } = await request.json();

    if (!profile_id) {
      return new Response(
        JSON.stringify({ error: 'profile_id is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🔍 Fetching workload for profile:', profile_id);

    // Get specific person's manpower data
    const { data: personData, error: personError } = await supabaseAdmin
      .from('manpower_allocation')
      .select('*')
      .eq('profile_id', profile_id)
      .single();

    if (personError) {
      console.error('❌ Error fetching person data:', personError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch person data', details: personError.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get detailed project breakdown
    const { data: projectDetails, error: detailsError } = await supabaseAdmin
      .from('manpower_project_details')
      .select('*')
      .eq('profile_id', profile_id)
      .order('project_status', { ascending: false });

    if (detailsError) {
      console.error('❌ Error fetching project details:', detailsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch project details', details: detailsError.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Fetched person details with', projectDetails?.length || 0, 'projects');

    return new Response(
      JSON.stringify({
        person: personData,
        projects: projectDetails || [],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('❌ POST handler error:', err);
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