// app/api/quizzes/[roomCode]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../supabaseAdmin";

export async function GET(request, context) {
  try {

    const params = await context.params; 
    const roomCode = params?.roomCode;
    // console.log("roomCode:", roomCode);

    if (!roomCode) {
      return NextResponse.json({ error: "Missing roomCode" }, { status: 400 });
    }

    // Fetch quiz from Supabase
    const { data: quiz, error } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("room_code", roomCode)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch quiz" },
        { status: 500 }
      );
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
