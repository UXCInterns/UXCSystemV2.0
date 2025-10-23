// // lib/supabase/tokenRefresh.js
// import { supabase } from './supabaseClient';

// export async function refreshAuthToken() {
//   try {
//     const { data, error } = await supabase.auth.refreshSession();
    
//     if (error || !data.session) {
//       console.error('Failed to refresh token:', error);
//       return false;
//     }

//     // Update the cookie with new tokens - NO max-age
//     const tokenData = {
//       access_token: data.session.access_token,
//       refresh_token: data.session.refresh_token,
//       expires_at: data.session.expires_at,
//     };

//     document.cookie = `auth-token=${JSON.stringify(tokenData)}; path=/; SameSite=Lax`;
    
//     console.log('✅ Token refreshed successfully');
//     return true;
//   } catch (err) {
//     console.error('Error refreshing token:', err);
//     return false;
//   }
// }

// export function clearAuthCookie() {
//   document.cookie = 'auth-token=; path=/; max-age=0';
// }

// export async function signOut() {
//   await supabase.auth.signOut();
//   clearAuthCookie();
//   window.location.href = '/signin';
// }