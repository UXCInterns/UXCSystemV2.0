import React from "react";
import { UserInfoEditModalProps } from "@/types/UserProfileTypes/UserInfo";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import UserInfoFormField from "./UserInfoFormField";

export default function UserInfoEditModal({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSave,
  saving
}: UserInfoEditModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <UserInfoFormField
                  label="First Name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={onInputChange}
                />

                <UserInfoFormField
                  label="Last Name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={onInputChange}
                />

                <UserInfoFormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={onInputChange}
                />

                <UserInfoFormField
                  label="Birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={onInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button 
              size="md" 
              variant="outline" 
              onClick={onClose}
              disabled={saving}
            >
              Close
            </Button>
            <Button 
              size="md" 
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}