import React from "react";
import { UserMetaDisplayProps } from "@/types/UserProfileTypes/UserMeta";
import { getSocialLinks } from "@/utils/UserProfileUtils/UserMetaCardUtils/UserMetaUtils";
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo, { ProfileFormData } from "./ProfileInfo";

interface UserMetaDisplayWithSaveProps extends UserMetaDisplayProps {
  updateProfile: (data: ProfileFormData) => Promise<boolean>;
}

export default function UserMetaDisplay({
  profile,
  userName,
  userProfileImage,
  onAvatarClick,
  onBannerClick,      
  updateProfile
}: UserMetaDisplayWithSaveProps) {
  const socialLinks = getSocialLinks(profile);
  const avatarUrl = profile.avatar_url || userProfileImage || "/images/user/owner.jpg";

  const handleSaveProfile = async (data: ProfileFormData) => {
    const success = await updateProfile(data);
    if (success) {
      console.log("Profile updated!");
      // Optional: toast here
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl dark:border-gray-800 overflow-hidden">
      <ProfileBanner
        bannerUrl={profile.banner_url}
        onEdit={onBannerClick}
      />
      
      <div className="relative px-5 pb-6 lg:px-6">
        <ProfileAvatar
          avatarUrl={avatarUrl}
          onClick={onAvatarClick}
        />

        <ProfileInfo
          fullName={profile.full_name || userName}
          bio={profile.bio}
          jobTitle={profile.job_title}
          role={profile.role}
          socialLinks={socialLinks}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
}