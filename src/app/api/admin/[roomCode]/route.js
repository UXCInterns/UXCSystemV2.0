import { supabaseAdmin } from "../../supabaseAdmin";

const calculateStats = (participants) => {
  const completed = participants.filter(
    (p) => p.responses && p.responses.length > 0
  ).length;

  return {
    participants,
    total: participants.length,
    completed,
    pending: participants.length - completed,
    completionRate:
      participants.length === 0
        ? 0
        : Math.round((completed / participants.length) * 100),
  };
};

export async function GET(req, { params }) {
 
  const { roomCode } = await params;

  const { data: participants, error } = await supabaseAdmin
    .from("participants")
    .select(`
      *,
      responses (
        id,
        completed,
        answers,
        created_at
      )
    `)
    .eq("room_code", roomCode)
    .order("created_at", { ascending: true })


    

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const stats = calculateStats(participants);

  return Response.json(stats);
}
