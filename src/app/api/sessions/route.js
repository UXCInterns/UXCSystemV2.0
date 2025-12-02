//Creation of Session

import { supabaseAdmin } from '../supabaseAdmin';
import { NextResponse } from 'next/server';



export async function POST(request) {
  try {
    const body = await request.json();
  
    const { title } = body;

    if (!title) {
     
      return NextResponse.json(
        { error: "Missing title" },
        { status: 400 }
      );
    }

    // Insert only the title
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .insert([{ title }])
      .select()
      .single();

    if (error) {
      console.log(" Supabase insert error:", error); 
      throw error;
    }

    console.log(" Session created:", data); // session created log

    return NextResponse.json(
      { message: "Session created successfully", session: data },
      { status: 201 }
    );
  } catch (err) {
    console.log(" Error in POST /api/sessions:", err); // Log unexpected errors
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
