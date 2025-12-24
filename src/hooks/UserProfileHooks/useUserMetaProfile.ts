import { useState, useEffect } from "react";
import { UserMetaProfile } from "@/types/UserProfileTypes/UserMeta";
import { ProfileFormData } from "@/components/user-profile/UserMetaCard/ProfileInfo";

export function useUserMetaProfile(userId: string | null) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserMetaProfile>({
    full_name: "",
    bio: "",
    role: "",
    job_title: "",
    avatar_url: "",
    banner_url: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: ""
  });

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profiles?id=${userId}`);
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileFormData) => {
    if (!userId) return false;
    
    setSaving(true);
    try {
      const response = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          full_name: profileData.fullName,
          bio: profileData.bio,
          job_title: profileData.jobTitle,
          role: profileData.role,
          facebook_url: profileData.facebook,
          twitter_url: profileData.twitter,
          linkedin_url: profileData.linkedin,
          instagram_url: profileData.instagram,
        }),
      });

      const data = await response.json();

      if (response.ok && data.profile) {
        setProfile(data.profile);
        return true;
      } else {
        console.error("Failed to save profile:", data.error);
        alert("Failed to save profile. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!userId) return false;
    
    setSaving(true);
    try {
      const response = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          avatar_url: avatarUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.profile) {
        setProfile(prev => ({ ...prev, avatar_url: data.profile.avatar_url }));
        return true;
      } else {
        console.error("Failed to save avatar:", data.error);
        alert("Failed to save avatar. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error saving avatar:", error);
      alert("An error occurred while saving. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateBanner = async (bannerUrl: string) => {
    if (!userId) return false;
    
    setSaving(true);
    try {
      const response = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          banner_url: bannerUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.profile) {
        setProfile(prev => ({ ...prev, banner_url: data.profile.banner_url }));
        return true;
      } else {
        console.error("Failed to save banner:", data.error);
        alert("Failed to save banner. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("An error occurred while saving. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    profile,
    updateProfile,
    updateAvatar,
    updateBanner
  };
}