import { supabaseAdmin } from '../supabaseAdmin';

//creation of the evaluation form for the participants

// export GET route
export async function POST(request) {
  try {
    const body = await request.json();

    const { title, trainers, start_date, end_date, scale_type, custom_scale, questions } = body;

    // Validate required fields
    if (!title || !start_date || !end_date) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, start_date, end_date' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    //  Insert session into 'sessions' table
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert([{ title, start_date, end_date }])
      .select();

    if (sessionError) throw sessionError;

    const sessionId = sessionData[0].id;

    // Optionally, insert trainer mappings
    if (trainers && trainers.length > 0) {
      const trainerEntries = trainers.map((trainer) => ({
        session_id: sessionId,
        trainer_type: trainer.type,
        trainer_id: trainer.id || null,
        trainer_name: trainer.name || null,
        trainer_email: trainer.email || null,
      }));

      const { error: trainerError } = await supabaseAdmin
        .from('session_trainers')
        .insert(trainerEntries);

      if (trainerError) throw trainerError;
    }

    //  Optionally, insert questions
    if (questions && questions.length > 0) {
      const questionEntries = questions.map((q) => ({
        session_id: sessionId,
        question_text: q.question,
        statements: q.statements || [],
        scale_type,
        custom_scale,
      }));

      const { error: questionError } = await supabaseAdmin
        .from('session_questions')
        .insert(questionEntries);

      if (questionError) throw questionError;
    }

    return new Response(
      JSON.stringify({
        message: 'Session created ',
        // session: sessionData[0],
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
