// hooks/useUser.ts
import { useAuth } from '@/context/AuthContext';

export const useUser = () => {
  const { user, profile, loading } = useAuth();

  // Return user data from profiles table, with fallbacks to auth metadata
  return {
    name: profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: profile?.email || user?.email || '',
    profileImage: profile?.avatar_url || user?.user_metadata?.avatar_url || '/images/user/owner.jpg',
    id: user?.id || '',
    loading,
    // Additional profile fields
    createdAt: profile?.created_at || '',
    updatedAt: profile?.updated_at || '',
    // Full profile object if needed
    profile,
  };
};