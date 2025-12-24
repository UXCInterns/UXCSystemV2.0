"use client";
import React from "react";
import { useModal } from "../../../hooks/useModal";
import { useUser } from "../../../hooks/useUser";
import { useAddressProfile } from "@/hooks/UserProfileHooks/useAddressProfile";
import AddressDisplay from "./AddressDisplay";
import AddressEditModal from "./AddressEditModal";

export default function UserAddressCard() {
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
  } = useAddressProfile(userId);

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
      <AddressDisplay
        country={profile.country}
        city={profile.city}
        postal_code={profile.postal_code}
        address={profile.address}
        onEdit={handleOpenModal}
      />
      
      <AddressEditModal
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