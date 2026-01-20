"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/utils/UserProfileUtils/UserInfoCardUtils/UserInfoUtils";
import UserInfoField from "../UserInfoCard/UserInfoField";

interface UserProfile {
  id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar_url: string;
  banner_url?: string;
  job_title?: string;
  bio?: string;
  role?: string;
  birthday?: string;
  date_joined?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  facebook_url?: string;
}

export default function FriendsInfoCard() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchUserProfile(params.id as string);
    }
  }, [params?.id]);

  async function fetchUserProfile(userId: string) {
    try {
      const response = await fetch(`/api/profiles?id=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const { profile: data } = await response.json();
      
      if (!data) {
        throw new Error('Profile not found');
      }
      
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 mb-4">{error || "Profile not found"}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 w-full lg:w-[400px]">
            <UserInfoField 
              label="First Name" 
              value={profile.first_name} 
            />
            <UserInfoField 
              label="Last Name" 
              value={profile.last_name} 
            />
            <UserInfoField 
              label="Phone" 
              value={profile.phone} 
            />
            <UserInfoField 
              label="Birthday" 
              value={profile.birthday}
              formatValue={formatDate}
            />
            <UserInfoField 
              label="Email address" 
              value={profile.email} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}