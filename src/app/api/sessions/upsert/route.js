import { start } from 'repl';
import { supabaseAdmin } from '../../supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {

    const {
      id: quizId,
      session_id,
      title,
      questions = [],
      trainers = [],
      scale_type = null,
      custom_scale = null,
      start_date = startDate,
      end_date = endDate,

    } = await request.json();

console.log("this is the start date",start_date  )
console.log("this is the end date",end_date  )

    //  Basic validation
    if (!session_id || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //  Ensure session exists
    const { data: sessionExists, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("id")
      .eq("id", session_id)
      .single();

    if (sessionError || !sessionExists) {
      return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
    }

    // Handle room_code
    let room_code;
    if (quizId) {
      const { data: existingQuiz, error: fetchError } = await supabaseAdmin
        .from('quizzes')
        .select('room_code')
        .eq('id', quizId)
        .single();

      if (fetchError) throw fetchError;
      room_code = existingQuiz.room_code;
    } else {
      room_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    }



    console.log(" Upserting quiz data:", { room_code });


    //  Upsert quiz
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .upsert(
        {
          id: quizId,
          session_id,
          title,
          questions,
          trainers,
          scale_type,
          custom_scale,
          start_date,
          end_date,
          room_code,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (quizError) throw quizError;

    return NextResponse.json(
      { message: "Quiz created/updated successfully", quiz, room_code },
      { status: 201 }
    );

  } catch (error) {
    console.error(" Error creating/updating quiz:", error);
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
