import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../supabaseAdmin";

// Utility: generate a random 6-digit numeric ID
const generateRandomId = () => Math.floor(100000 + Math.random() * 900000);


export async function POST(request) {
  try {
    const body = await request.json();
    const { roomCode } = body;

    if (!roomCode) {
      console.error(" Missing roomCode !:", body);
      return NextResponse.json({ error: "Room code is required." }, { status: 400 });
    }

    // Check if quiz exists and hasn't ended
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("end_date")
      .eq("room_code", roomCode)
      .maybeSingle(); 

    if (quizError || !quiz || new Date(quiz.end_date) <= new Date()) {
      console.error(" Quiz not found or has ended:", { roomCode, quizError });
      return NextResponse.json({ error: "Quiz not found or has ended." }, { status: 404 });
    }

    //  Generate unique numeric participant ID
    let participantId;
    let uniqueIdFound = false;
    let attempts = 0;
    const maxAttempts = 20;

    while (!uniqueIdFound && attempts < maxAttempts) {
      participantId = generateRandomId();

      const { data: existingParticipant, error: existingError } = await supabaseAdmin
        .from("participants")
        .select("id")
        .eq("room_code", roomCode)
        .eq("name", participantId.toString())
        .maybeSingle();

      if (!existingParticipant && !existingError) {
        // ID is unique and available
        uniqueIdFound = true;
      }

      attempts++;
    }

    if (!uniqueIdFound) {
      console.error("Failed to generate unique participant ID after max attempts");
      return NextResponse.json(
        { error: "Unable to join quiz. Please try again." },
        { status: 500 }
      );
    }

    // 3️⃣ Insert new participant
    const { data, error } = await supabaseAdmin
      .from("participants")
      .insert({
        name: participantId.toString(),
        room_code: roomCode,
      })
      .select();

    if (error) {
      console.error("  Error inserting new participant:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(" Participant joined successfully:", {
      participantId: data[0].id,
      roomCode,
      numericId: participantId,
    });

    //  Respond with participant details
    return NextResponse.json(
      {
        participant: {
          ...data[0],
          numericId: participantId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Handle non-POST methods
export function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
