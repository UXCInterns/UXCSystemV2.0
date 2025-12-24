import React, { useState } from "react";
import { formatDisplayText } from "@/utils/UserProfileUtils/UserMetaCardUtils/UserMetaUtils";
import SocialLinks from "./SocialLinks";
import { SocialLink } from "@/types/UserProfileTypes/UserMeta";
import { PencilIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import ProfileInfoEditModal from "./ProfileInfoEditModal";

interface ProfileInfoProps {
  fullName: string;
  bio: string;
  jobTitle: string;
  role?: string;
  socialLinks: SocialLink[];
  onSave?: (data: ProfileFormData) => Promise<void>;
}

export interface ProfileFormData {
  fullName: string;
  bio: string;
  jobTitle: string;
  role: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export default function ProfileInfo({
  fullName,
  bio,
  jobTitle,
  role,
  socialLinks,
  onSave
}: ProfileInfoProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: fullName || "",
    bio: bio || "",
    jobTitle: jobTitle || "",
    role: role || "",
    facebook: socialLinks.find(l => l.platform === 'facebook')?.url || "",
    twitter: socialLinks.find(l => l.platform === 'twitter')?.url || "",
    linkedin: socialLinks.find(l => l.platform === 'linkedin')?.url || "",
    instagram: socialLinks.find(l => l.platform === 'instagram')?.url || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave(formData);
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error saving profile:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        
        <div className="flex-1 text-center lg:text-left">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            {formatDisplayText(fullName, "User Name")}
          </h4>

          <div className="flex flex-col gap-4 mt-1">
            {bio && (
              <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
                {formatDisplayText(bio)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {jobTitle && (
              <Badge variant="light" color="primary" size="md">
                {formatDisplayText(jobTitle)}
              </Badge>
            )}
            {role && (
              <Badge variant="light" color="purple" size="md">
                {formatDisplayText(role)}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-6 lg:items-end">
          <SocialLinks links={socialLinks} />
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <PencilIcon />
            Edit
          </button>
        </div>
      </div>

      <ProfileInfoEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}