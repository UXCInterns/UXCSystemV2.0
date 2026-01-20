"use client";
import { useState, useEffect } from "react";
import SocialLinkIcon from "../UserMetaCard/SocialLinkIcon";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

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

export default function FriendsMetaCard() {
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

  const allPlatforms: Array<'facebook' | 'twitter' | 'linkedin' | 'instagram'> = [
    'facebook', 'twitter', 'linkedin', 'instagram'
  ];

  // Create a map of platform to URL
  const linkMap: Record<string, string> = {
    facebook: profile.facebook_url || '',
    twitter: profile.twitter_url || '',
    linkedin: profile.linkedin_url || '',
    instagram: profile.instagram_url || ''
  };

  return (
    <div className="border border-gray-200 rounded-2xl dark:border-gray-800 overflow-hidden relative">
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        size="sm"
        variant="outline"
        startIcon={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        }
        className="absolute top-4 left-4 z-10"
      >
        Back
      </Button>

      {/* Banner */}
      <div className="h-60 bg-gradient-to-r from-blue-500 to-purple-600 relative group">
        {profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt="banner"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-5 pb-6 lg:px-6">
        <div className="flex justify-start -mt-35 mb-3">
          <div className="w-45 h-45 overflow-hidden border-4 border-white dark:border-gray-900 rounded-full bg-white dark:bg-gray-900 group relative">
            <Image
              width={160}
              height={160}
              src={profile.avatar_url || "/images/user/owner.jpg"}
              alt="user"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name, Bio, Job, Role */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 text-center lg:text-left">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {profile.full_name || "User Name"}
            </h4>

            <div className="flex flex-col gap-4 mt-1">
              {profile.bio && (
                <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {profile.job_title && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  {profile.job_title}
                </span>
              )}
              {profile.role && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                  {profile.role}
                </span>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center lg:justify-start gap-2">
            {allPlatforms.map((platform) => (
              <SocialLinkIcon
                key={platform}
                url={linkMap[platform]}
                platform={platform}
                disabled={!linkMap[platform]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}