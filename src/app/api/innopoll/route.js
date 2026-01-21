import { NextResponse } from "next/server";
import { supabaseAdmin } from "../supabaseAdmin";

export async function GET() {

   
  try {
    const { data, error } = await supabaseAdmin.rpc("get_session_quiz_details");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { status: 500 }
    );
  }
}
