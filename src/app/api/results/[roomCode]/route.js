// api/results/[roomCode]/route.ts
import { supabase } from "../../../../../lib/supabase/supabaseClient";

export async function GET(req, context) {
  const { roomCode } = await context.params;

  // Fetch all responses for this room
  const { data: responses, error: responsesError } = await supabase
    .from("responses")
    .select("*, participants(name)")
    .eq("room_code", roomCode);

  if (responsesError) {
    return Response.json({ error: "Error fetching results" }, { status: 500 });
  }

  // Fetch quiz metadata
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("room_code", roomCode)
    .single();

  if (quizError) {
    return Response.json({ error: "Error fetching quiz details" }, { status: 500 });
  }

  return Response.json({ responses, quiz });
}
