import React from "react";
import { AddressEditModalProps } from "@/types/UserProfileTypes/Address";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import AddressFormField from "./AddressFormField";

export default function AddressEditModal({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSave,
  saving
}: AddressEditModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Address
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your address details to keep your profile up-to-date.
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="px-2 pb-3 overflow-y-auto custom-scrollbar max-h-[450px]">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Address
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <AddressFormField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                />

                <AddressFormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={onInputChange}
                />

                <AddressFormField
                  label="Postal Code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={onInputChange}
                />

                <AddressFormField
                  label="Address"
                  name="address"
                  value={formData.address}
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