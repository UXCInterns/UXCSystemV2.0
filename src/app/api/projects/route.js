import { supabaseAdmin } from '../supabaseAdmin';


export async function GET() {
  try {

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select(`
    project_id,
    project_name,
    start_date,
    end_date,
    status,
    description,
    created_at,
    updated_at,
    project_members (
      id ,
      project_id,
      role
    )
  `)
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // console.log("Projects fetched:", data?.length);

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("GET handler error:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



//creating a project - w/o assigning anybody yet - to rmb to allow user to add user
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.project_name || !body.start_date || !body.end_date || !body.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, start_date, end_date , status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([body])
      .select(); // Return the inserted record

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


//update single project
export async function PUT(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id) {
      return new Response(
        JSON.stringify({ error: 'ID is required for updating' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.project_name || !body.start_date || !body.end_date || !body.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, start_date, end_date , status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract id from body and create update object without id
    const { id, ...updateData } = body;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select(); // Return the updated record

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // First check if the record exists
    const { data: existingRecord, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingRecord) {
      return new Response(
        JSON.stringify({ error: 'Record not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the record
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Record deleted successfully', id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}