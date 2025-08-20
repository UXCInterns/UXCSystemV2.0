"use client";
import { supabase } from "./supabaseClient";

export async function handleOAuthRedirect() {
  const { data, error } = await supabase.auth.getSession({
    storeSession: true, // stores in local storage/cookies
  });

  if (error) {
    console.error(error);
    return;
  }

  if (data.session) {
    console.log("Logged in user:", data.session.user);
    // Remove tokens from URL
    window.history.replaceState({}, document.title, "/home");
  }
}
