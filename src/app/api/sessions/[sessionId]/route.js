import { supabaseAdmin } from "../../supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { sessionId } = await context.params;

    // Fetch session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();



    if (sessionError) throw sessionError;

    // Fetch quiz
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    console.log(quiz)


    if (quizError) throw quizError;

    return new Response(JSON.stringify({ session, quiz }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request, { params }) {

  try {
    const { sessionId } = await params;
    const { title } = await request.json();

    if (!title || !sessionId) {
      return NextResponse.json(
        { error: "Session ID and title are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("sessions")
      .update({ title })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Session title updated", session: data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to update title" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { sessionId } =  await params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Delete quizzes first (if any)
    const { error: quizError } = await supabaseAdmin
      .from('quizzes')
      .delete()
      .eq('session_id', sessionId)

    if (quizError) throw quizError

    // Delete session
    const { error: sessionError } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('id', sessionId)

    if (sessionError) throw sessionError

    return NextResponse.json(
      { message: 'Session and quizzes deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete session' },
      { status: 500 }
    )
  }
}




