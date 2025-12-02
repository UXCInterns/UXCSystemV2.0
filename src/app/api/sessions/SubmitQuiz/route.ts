//app/api/sessions/SubmitQuiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    //submitting consolitdated answers in an array
    const submission = await req.json();

    //POSTING IT HERE
    console.log("submitting consolidated answers :", submission.answers)
    
    const { data, error } = await supabaseAdmin
      .from("responses")
      .insert([submission]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message:"Response Submitted" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}