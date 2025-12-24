import React from "react";
import { UserInfoFieldProps } from "@/types/UserProfileTypes/UserInfo";
import { formatDisplayValue } from "@/utils/UserProfileUtils/UserInfoCardUtils/UserInfoUtils";

export default function UserInfoField({ 
  label, 
  value, 
  formatValue 
}: UserInfoFieldProps) {
  const displayValue = formatValue ? formatValue(value) : formatDisplayValue(value);
  
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {displayValue}
      </p>
    </div>
  );
}