// // app/auth/callback-client/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '../../../lib/supabase/supabaseClient';

// export default function AuthCallbackClient() {
//   const router = useRouter();
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   useEffect(() => {
//     // Supabase client will automatically detect the code in URL and exchange it
//     // We just need to wait for the session to be established
    
//     const handleCallback = async () => {
//       try {
//         console.log('🔄 Waiting for Supabase to process auth callback...');

//         // Check if we have a session after Supabase processes the URL
//         const { data: { session }, error } = await supabase.auth.getSession();

//         if (error) {
//           console.error('❌ Error getting session:', error);
//           setStatus('error');
//           setErrorMessage(error.message);
//           setTimeout(() => router.push('/signin?error=auth_failed'), 2000);
//           return;
//         }

//         if (session) {
//           console.log('✅ Session established:', session.user?.email);
//           setStatus('success');
//           // Give the auth context time to update
//           setTimeout(() => {
//             router.push('/home');
//           }, 500);
//         } else {
//           console.log('⏳ No session yet, waiting...');
//           // Session might not be ready yet, wait a bit and try again
//           setTimeout(async () => {
//             const { data: { session: retrySession } } = await supabase.auth.getSession();
//             if (retrySession) {
//               console.log('✅ Session established on retry:', retrySession.user?.email);
//               setStatus('success');
//               setTimeout(() => router.push('/home'), 500);
//             } else {
//               console.error('❌ No session after retry');
//               setStatus('error');
//               setErrorMessage('Failed to establish session');
//               setTimeout(() => router.push('/signin'), 2000);
//             }
//           }, 1000);
//         }
//       } catch (err: any) {
//         console.error('❌ Unexpected error during callback:', err);
//         setStatus('error');
//         setErrorMessage(err.message || 'An unexpected error occurred');
//         setTimeout(() => router.push('/signin'), 2000);
//       }
//     };

//     handleCallback();
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center max-w-md px-4">
//         {status === 'error' ? (
//           <>
//             <div className="text-red-600 text-xl mb-2">❌ Authentication Failed</div>
//             <p className="text-gray-600 mb-4">{errorMessage}</p>
//             <p className="text-sm text-gray-500">Redirecting to sign in...</p>
//           </>
//         ) : status === 'success' ? (
//           <>
//             <div className="text-green-600 text-xl mb-2">✅ Sign In Successful</div>
//             <p className="text-gray-600">Redirecting to your dashboard...</p>
//           </>
//         ) : (
//           <>
//             <div className="text-blue-600 text-xl mb-2">🔄 Completing sign in...</div>
//             <p className="text-gray-600 mb-4">Please wait while we authenticate you.</p>
//             <div className="mt-4">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }