import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase/supabaseClient';

export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCurrentUserName(profile.full_name);
          setCurrentUserAvatar(profile.avatar_url);
        }
      }
    };
    getCurrentUser();
  }, []);

  return {
    currentUserId,
    currentUserName,
    currentUserAvatar
  };
}