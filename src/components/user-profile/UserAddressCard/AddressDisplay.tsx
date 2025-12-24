import React from "react";
import { AddressDisplayProps } from "@/types/UserProfileTypes/Address";
import AddressField from "./AddressField";
import { PencilIcon } from "@/icons";

export default function AddressDisplay({
  country,
  city,
  postal_code,
  address,
  onEdit
}: AddressDisplayProps) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Address
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 w-full lg:w-[400px]">
            <AddressField label="Country" value={country} />
            <AddressField label="City" value={city} />
            <AddressField label="Postal Code" value={postal_code} />
            <AddressField label="Address" value={address} />
          </div>
        </div>

        <button
          onClick={onEdit}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <PencilIcon />
          Edit
        </button>
      </div>
    </div>
  );
}