// lib/supabase/requireAuth.js
import { supabase } from '@/lib/supabase/supabaseClient'
import cookie from 'cookie'

export async function requireAuth(context) {
  const { req } = context

  // Parse cookies
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  const authToken = cookies['auth-token']

  if (!authToken) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }

  try {
    const tokenData = JSON.parse(authToken)
    if (!tokenData.access_token) {
      throw new Error('No access token found')
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(tokenData.access_token)

    if (error || !data.user) {
      throw new Error('User not found')
    }

    return {
      props: {
        user: data.user,
      },
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }
}
