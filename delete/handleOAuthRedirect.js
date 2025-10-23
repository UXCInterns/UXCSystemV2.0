// // "use client";
// // import { supabase } from "./supabaseClient";

// // export async function handleOAuthRedirect() {
// //   console.log("🔍 handleOAuthRedirect called");
// //   console.log("🔍 Current URL:", window.location.href);
  
// //   // Get hash parameters
// //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
// //   const access_token = hashParams.get('access_token');
// //   const refresh_token = hashParams.get('refresh_token');
// //   const expires_at = hashParams.get('expires_at');

// //   console.log("🔍 Tokens found:", { 
// //     access_token: access_token ? 'YES' : 'NO',
// //     refresh_token: refresh_token ? 'YES' : 'NO' 
// //   });

// //   if (access_token && refresh_token) {
// //     console.log("✅ Setting cookie directly from URL tokens");
    
// //     // Set cookie IMMEDIATELY with the tokens from URL
// //     const tokenData = {
// //       access_token: access_token,
// //       refresh_token: refresh_token,
// //       expires_at: expires_at ? parseInt(expires_at) : Date.now() / 1000 + 3600,
// //     };
    
// //     // REMOVE max-age so cookie expires when browser closes
// //     document.cookie = `auth-token=${JSON.stringify(tokenData)}; path=/; SameSite=Lax`;
    
// //     console.log("✅ Cookie set! Redirecting to /home");
    
// //     // Also set the Supabase session for the client
// //     try {
// //       await supabase.auth.setSession({
// //         access_token: access_token,
// //         refresh_token: refresh_token,
// //       });
// //       console.log("✅ Supabase session set");
// //     } catch (err) {
// //       console.error("⚠️ Supabase session error (but cookie is set):", err);
// //     }
    
// //     // Redirect
// //     window.location.href = "/home";
// //   } else {
// //     console.log("⚠️ No tokens in URL hash");
// //   }
// // }

// "use client";
// import { supabase } from "../lib/supabase/supabaseClient";

// /**
//  * Handles OAuth redirect and establishes Supabase session
//  * Uses Supabase's built-in session management instead of manual cookies
//  */
// export async function handleOAuthRedirect() {
//   console.log("🔍 handleOAuthRedirect called");
  
//   try {
//     // Let Supabase automatically handle the OAuth callback
//     // It will parse the hash fragments and establish the session
//     const { data, error } = await supabase.auth.getSession();
    
//     if (error) {
//       console.error("❌ Error getting session:", error.message);
//       // Redirect to login with error message
//       window.location.href = `/login?error=${encodeURIComponent(error.message)}`;
//       return;
//     }

//     if (data.session) {
//       console.log("✅ Session established successfully");
      
//       // Optional: Verify the session is valid
//       const { data: userData, error: userError } = await supabase.auth.getUser();
      
//       if (userError) {
//         console.error("❌ Error verifying user:", userError.message);
//         window.location.href = `/login?error=${encodeURIComponent("Session verification failed")}`;
//         return;
//       }
      
//       console.log("✅ User verified:", userData.user?.email);
      
//       // Clean redirect without hash parameters
//       window.location.replace("/home");
//     } else {
//       console.log("⚠️ No active session found");
//       window.location.href = "/login?error=no_session";
//     }
//   } catch (err) {
//     console.error("❌ Unexpected error during OAuth redirect:", err);
//     window.location.href = `/login?error=${encodeURIComponent("Authentication failed")}`;
//   }
// }

// /**
//  * Alternative: Use Supabase's onAuthStateChange listener (recommended for Next.js)
//  * Place this in a root layout or provider component
//  */
// export function setupAuthListener() {
//   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//     console.log("🔍 Auth state changed:", event);
    
//     if (event === 'SIGNED_IN' && session) {
//       console.log("✅ User signed in:", session.user.email);
//       // Session is automatically managed by Supabase
//     } else if (event === 'SIGNED_OUT') {
//       console.log("👋 User signed out");
//       // Clean up any client-side state if needed
//     } else if (event === 'TOKEN_REFRESHED') {
//       console.log("🔄 Token refreshed");
//     }
//   });

//   // Return cleanup function
//   return () => {
//     subscription.unsubscribe();
//   };
// }