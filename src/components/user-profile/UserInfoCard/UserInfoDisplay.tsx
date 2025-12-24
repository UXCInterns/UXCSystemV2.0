import React from "react";
import { UserInfoDisplayProps } from "@/types/UserProfileTypes/UserInfo";
import { formatDate } from "@/utils/UserProfileUtils/UserInfoCardUtils/UserInfoUtils";
import UserInfoField from "./UserInfoField";
import { PencilIcon } from "@/icons";

export default function UserInfoDisplay({
  profile,
  onEdit
}: UserInfoDisplayProps) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 w-full lg:w-[400px]">
            <UserInfoField 
              label="First Name" 
              value={profile.first_name} 
            />
            <UserInfoField 
              label="Last Name" 
              value={profile.last_name} 
            />
            <UserInfoField 
              label="Phone" 
              value={profile.phone} 
            />
            <UserInfoField 
              label="Birthday" 
              value={profile.birthday}
              formatValue={formatDate}
            />
            <UserInfoField 
              label="Email address" 
              value={profile.email} 
            />
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