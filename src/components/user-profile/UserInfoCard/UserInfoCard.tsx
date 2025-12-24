"use client";
import React from "react";
import { useModal } from "@/hooks/useModal";
import { useUser } from "@/hooks/useUser";
import { useUserInfoProfile } from "@/hooks/UserProfileHooks/useUserInfoProfile";
import UserInfoDisplay from "./UserInfoDisplay";
import UserInfoEditModal from "./UserInfoEditModal";

export default function UserInfoCard() {
  const { id: userId, loading: userLoading } = useUser();
  const { isOpen, openModal, closeModal } = useModal();
  const {
    loading,
    saving,
    profile,
    formData,
    handleInputChange,
    saveProfile,
    resetFormData
  } = useUserInfoProfile(userId);

  const handleOpenModal = () => {
    resetFormData();
    openModal();
  };

  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      closeModal();
    }
  };

  if (userLoading || loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <UserInfoDisplay
        profile={profile}
        onEdit={handleOpenModal}
      />
      
      <UserInfoEditModal
        isOpen={isOpen}
        onClose={closeModal}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}