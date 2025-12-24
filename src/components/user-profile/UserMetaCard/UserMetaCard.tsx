"use client";
import React, { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserMetaProfile } from "@/hooks/UserProfileHooks/useUserMetaProfile";
import { useImageUpload } from "@/hooks/UserProfileHooks/useImageUpload";
import UserMetaDisplay from "./UserMetaDisplay";
import ImageUploadModal from "./ImageUploadModal";
import { ImageCropper } from "../UserImageCropper";

export default function UserMetaCard() {
  const { id: userId, loading: userLoading, name, profileImage } = useUser();
  const { loading, saving, profile, updateAvatar, updateBanner, updateProfile } = useUserMetaProfile(userId);
  
  
  // Avatar upload state
  const [showAvatarModal, setShowAvatarModal] = React.useState(false);
  const avatarUpload = useImageUpload(profile.avatar_url);
  
  // Banner upload state
  const [showBannerModal, setShowBannerModal] = React.useState(false);
  const bannerUpload = useImageUpload(profile.banner_url);

  // Update previews when profile changes
  useEffect(() => {
    avatarUpload.resetPreview(profile.avatar_url || "");
    bannerUpload.resetPreview(profile.banner_url || "");
  }, [profile.avatar_url, profile.banner_url]);

  // Avatar handlers
  const handleAvatarClick = () => setShowAvatarModal(true);
  
  const handleAvatarSave = async () => {
    if (!avatarUpload.preview) return;
    const success = await updateAvatar(avatarUpload.preview);
    if (success) {
      setShowAvatarModal(false);
      avatarUpload.handleCancelCrop();
    }
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
    avatarUpload.handleCancelCrop();
    avatarUpload.resetPreview(profile.avatar_url || "");
  };

  // Banner handlers
  const handleBannerClick = () => setShowBannerModal(true);
  
  const handleBannerSave = async () => {
    if (!bannerUpload.preview) return;
    const success = await updateBanner(bannerUpload.preview);
    if (success) {
      setShowBannerModal(false);
      bannerUpload.handleCancelCrop();
    }
  };

  const closeBannerModal = () => {
    setShowBannerModal(false);
    bannerUpload.handleCancelCrop();
    bannerUpload.resetPreview(profile.banner_url || "");
  };

  if (userLoading || loading) {
    return (
      <div className="border border-gray-200 rounded-2xl dark:border-gray-800 overflow-hidden">
        <div className="p-5 lg:p-6">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserMetaDisplay
        profile={profile}
        userName={name || ""}
        userProfileImage={profileImage || ""}
        onAvatarClick={handleAvatarClick}
        onBannerClick={handleBannerClick}
        updateProfile={updateProfile} 
      />

      {/* Avatar Modal */}
      {!avatarUpload.showCropper ? (
        <ImageUploadModal
          isOpen={showAvatarModal}
          onClose={closeAvatarModal}
          imagePreview={avatarUpload.preview}
          onFileSelect={avatarUpload.handleFileSelect}
          onSave={handleAvatarSave}
          onEditClick={avatarUpload.handleEditClick}
          saving={saving}
          fileInputRef={avatarUpload.fileInputRef}
          title="Update Profile Picture"
          description="Choose a photo to represent your profile"
          isAvatar={true}
        />
      ) : (
        <ImageCropper
          image={avatarUpload.tempImage}
          onCrop={avatarUpload.handleCrop}
          onCancel={avatarUpload.handleCancelCrop}
          aspectRatio={1}
          isCircular={true}
          isOpen={avatarUpload.showCropper}
        />
      )}

      {/* Banner Modal */}
      {!bannerUpload.showCropper ? (
        <ImageUploadModal
          isOpen={showBannerModal}
          onClose={closeBannerModal}
          imagePreview={bannerUpload.preview}
          onFileSelect={bannerUpload.handleFileSelect}
          onSave={handleBannerSave}
          onEditClick={bannerUpload.handleEditClick}
          saving={saving}
          fileInputRef={bannerUpload.fileInputRef}
          title="Update Cover Photo"
          description="Choose a banner image for your profile (16:9 ratio recommended)"
          isAvatar={false}
        />
      ) : (
        <ImageCropper
          image={bannerUpload.tempImage}
          onCrop={bannerUpload.handleCrop}
          onCancel={bannerUpload.handleCancelCrop}
          aspectRatio={16/9}
          isCircular={false}
          isOpen={bannerUpload.showCropper}
        />
      )}
    </>
  );
}