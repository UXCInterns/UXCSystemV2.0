import { supabaseAdmin } from '../supabaseAdmin';

function parseDuration(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") return value;

  if (!isNaN(value)) return Number(value);

  if (typeof value === "string") {
    const match = value.match(/\d+/g);

    if (!match) return null;

    // if format like "2h 30m"
    if (value.includes("h")) {
      const hours = Number(match[0] || 0);
      const mins = Number(match[1] || 0);
      return hours * 60 + mins;
    }

    return Number(match[0]);
  }

  return null;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('learning_journeys')
      .select('*')
      .order('date_of_visit', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
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

export async function POST(request) {
  try {
    const body = await request.json();
        
    // Validate required fields
    if (!body.company_name || !body.date_of_visit || !body.start_time || !body.end_time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: company_name, date_of_visit, start_time, end_time' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('learning_journeys')
      const { duration, ...rest } = body;

      const insertData = {
        ...rest,
        duration: parseDuration(duration),
      };

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

    if (!body.company_name || !body.date_of_visit || !body.start_time || !body.end_time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: company_name, date_of_visit, start_time, end_time' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract id from body and create update object without id
    const { id, duration, ...rest } = body;

    const updateData = {
      ...rest,
      duration: parseDuration(duration),
    };

    const { data, error } = await supabaseAdmin
      .from('learning_journeys')
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
      .from('learning_journeys')
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
      .from('learning_journeys')
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