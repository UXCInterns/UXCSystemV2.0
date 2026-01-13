// app/api/sessions/[roomCode]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../supabaseAdmin";

export async function GET(req, { params }) {
  
  const { roomCode } = await params;


  if (!roomCode) {
    return NextResponse.json(
      { error: "Room code is required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Fetch quiz by room_code
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("id, session_id, room_code, title, questions, start_date, end_date")
      .eq("room_code", roomCode)
      .single();

    if (quizError || !quiz) {
      console.error("Quiz not found:", quizError);
      return NextResponse.json(
        { error: "Quiz not found for this room code" },
        { status: 404 }
      );
    }

    // Step 2: Fetch session info
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("id", quiz.session_id)
      .single();

    if (sessionError || !session) {
      console.error("Session not found:", sessionError);
      return NextResponse.json(
        { error: "Session not found for this quiz" },
        { status: 404 }
      );
    }

    // Step 3: Return JSON with quiz + session
  
    return NextResponse.json({
      quiz,
      session,
    });
  } catch (err) {
    console.error("Unexpected error fetching quiz:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
