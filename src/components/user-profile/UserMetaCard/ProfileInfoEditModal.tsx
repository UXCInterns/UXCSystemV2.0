import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";

interface ProfileInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    fullName: string;
    bio: string;
    jobTitle: string;
    role: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  saving: boolean;
}

export default function ProfileInfoEditModal({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSave,
  saving
}: ProfileInfoEditModalProps) {
  const handleTextAreaChange = (name: string) => (value: string) => {
    onInputChange({
      target: { name, value }
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Profile Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your profile details and social links.
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="custom-scrollbar max-h-[500px] overflow-y-auto px-2 pb-3">
            {/* Basic Information */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                Basic Information
              </h5>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <TextArea
                    rows={3}
                    value={formData.bio}
                    onChange={handleTextAreaChange('bio')}
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Title
                    </label>
                    <Input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={onInputChange}
                      placeholder="e.g. Senior Developer"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <Input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={onInputChange}
                      placeholder="e.g. Team Lead"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                Social Links
              </h5>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Facebook
                  </label>
                  <Input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={onInputChange}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter/X
                  </label>
                  <Input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={onInputChange}
                    placeholder="https://x.com/username"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    LinkedIn
                  </label>
                  <Input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={onInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instagram
                  </label>
                  <Input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={onInputChange}
                    placeholder="https://instagram.com/username"
                  />
                </div>
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