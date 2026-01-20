import React from "react";
import { AddressFieldProps } from "@/types/UserProfileTypes/Address";
import { formatAddressDisplay } from "@/utils/UserProfileUtils/UserAddressCardUtils/addressUtils";

export default function AddressField({ label, value }: AddressFieldProps) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {formatAddressDisplay(value) || "Not Set"}
      </p>
    </div>
  );
}