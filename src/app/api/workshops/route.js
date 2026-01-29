import { supabaseAdmin } from '../supabaseAdmin';

export async function GET() {
  try {
    // Get all workshops with their type-specific data
    const { data: workshops, error: workshopsError } = await supabaseAdmin
      .from('workshops')
      .select('*')
      .order('program_start_date', { ascending: false });

    if (workshopsError) throw workshopsError;

    // Get PACE workshop categories
    const { data: paceWorkshops, error: paceError } = await supabaseAdmin
      .from('paceworkshops')
      .select('workshop_id, category');

    if (paceError) throw paceError;

    // Get NON-PACE workshop CSC status
    const { data: nonPaceWorkshops, error: nonPaceError } = await supabaseAdmin
      .from('nonpaceworkshops')
      .select('workshop_id, csc');

    if (nonPaceError) throw nonPaceError;

    // Create maps for efficient lookup
    const paceMap = new Map(paceWorkshops?.map(p => [p.workshop_id, p.category]) || []);
    const nonPaceMap = new Map(nonPaceWorkshops?.map(n => [n.workshop_id, n.csc]) || []);

    // Combine workshop data with type-specific fields
    const enrichedWorkshops = workshops?.map(workshop => {
      const enriched = { ...workshop };
      
      if (workshop.program_type === 'pace') {
        enriched.category = paceMap.get(workshop.id) || null;
      } else if (workshop.program_type === 'non_pace') {
        enriched.csc = nonPaceMap.get(workshop.id) || false;
      }
      
      return enriched;
    }) || [];

    return new Response(JSON.stringify(enrichedWorkshops), {
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
    const requiredFields = [
      'program_type',
      'school_dept',
      'course_program_title',
      'program_start_date',
      'program_end_date',
      'course_hours',
      'no_of_participants',
      'company_sponsored_participants',
      'trainee_hours'
    ];

    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate program_type
    if (!['pace', 'non_pace'].includes(body.program_type)) {
      return new Response(
        JSON.stringify({ error: 'program_type must be either "pace" or "non_pace"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate PACE-specific fields
    if (body.program_type === 'pace' && body.category) {
      const validCategories = ['DTBI', 'DT101', 'DTUX-LJ', 'SPID', 'DTAI'];
      if (!validCategories.includes(body.category)) {
        return new Response(
          JSON.stringify({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Extract type-specific fields
    const { category, csc, ...workshopData } = body;

    // Start a transaction
    // Insert into workshops table
    const { data: workshop, error: workshopError } = await supabaseAdmin
      .from('workshops')
      .insert([workshopData])
      .select()
      .single();

    if (workshopError) throw workshopError;

    // Insert into type-specific table
    if (body.program_type === 'pace' && category) {
      const { error: paceError } = await supabaseAdmin
        .from('paceworkshops')
        .insert([{
          workshop_id: workshop.id,
          category: category
        }]);

      if (paceError) {
        // Rollback by deleting the workshop
        await supabaseAdmin
          .from('workshops')
          .delete()
          .eq('id', workshop.id);
        throw paceError;
      }

      workshop.category = category;
    } else if (body.program_type === 'non_pace') {
      const { error: nonPaceError } = await supabaseAdmin
        .from('nonpaceworkshops')
        .insert([{
          workshop_id: workshop.id,
          csc: csc || false
        }]);

      if (nonPaceError) {
        // Rollback by deleting the workshop
        await supabaseAdmin
          .from('workshops')
          .delete()
          .eq('id', workshop.id);
        throw nonPaceError;
      }

      workshop.csc = csc || false;
    }

    return new Response(JSON.stringify(workshop), {
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

    const requiredFields = [
      'program_type',
      'school_dept',
      'course_program_title',
      'program_start_date',
      'program_end_date',
      'course_hours',
      'no_of_participants',
      'company_sponsored_participants',
      'trainee_hours'
    ];

    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract type-specific fields
    const { id, category, csc, ...workshopData } = body;

    // Update main workshop table
    const { data: workshop, error: workshopError } = await supabaseAdmin
      .from('workshops')
      .update({
        ...workshopData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (workshopError) throw workshopError;

    if (!workshop) {
      return new Response(
        JSON.stringify({ error: 'Workshop not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update type-specific fields
    if (workshop.program_type === 'pace') {
      if (category) {
        const validCategories = ['DTBI', 'DT101', 'DTUX-LJ', 'SPID', 'DTAI'];
        if (!validCategories.includes(category)) {
          return new Response(
            JSON.stringify({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Upsert into pace_workshops
        const { error: paceError } = await supabaseAdmin
          .from('paceworkshops')
          .upsert([{
            workshop_id: id,
            category: category
          }], { onConflict: 'workshop_id' });

        if (paceError) throw paceError;
        workshop.category = category;
      }

      // Remove from non_pace_workshops if it exists there
      await supabaseAdmin
        .from('nonpaceworkshops')
        .delete()
        .eq('workshop_id', id);

    } else if (workshop.program_type === 'non_pace') {
      // Upsert into non_pace_workshops
      const { error: nonPaceError } = await supabaseAdmin
        .from('nonpaceworkshops')
        .upsert([{
          workshop_id: id,
          csc: csc || false
        }], { onConflict: 'workshop_id' });

      if (nonPaceError) throw nonPaceError;
      workshop.csc = csc || false;

      // Remove from pace_workshops if it exists there
      await supabaseAdmin
        .from('paceworkshops')
        .delete()
        .eq('workshop_id', id);
    }

    return new Response(JSON.stringify(workshop), {
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

    // Check if the workshop exists
    const { data: existingWorkshop, error: fetchError } = await supabaseAdmin
      .from('workshops')
      .select('id, program_type')
      .eq('id', id)
      .single();

    if (fetchError || !existingWorkshop) {
      return new Response(
        JSON.stringify({ error: 'Workshop not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete from type-specific tables first (due to foreign key constraints)
    if (existingWorkshop.program_type === 'pace') {
      await supabaseAdmin
        .from('paceworkshops')
        .delete()
        .eq('workshop_id', id);
    } else if (existingWorkshop.program_type === 'non_pace') {
      await supabaseAdmin
        .from('nonpaceworkshops')
        .delete()
        .eq('workshop_id', id);
    }

    // Delete the main workshop record (this will cascade delete type-specific records if ON DELETE CASCADE is set)
    const { error } = await supabaseAdmin
      .from('workshops')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Workshop deleted successfully', id }),
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