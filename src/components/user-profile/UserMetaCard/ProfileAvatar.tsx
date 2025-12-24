import React from "react";
import Image from "next/image";

interface ProfileAvatarProps {
  avatarUrl: string;
  onClick: () => void;
}

export default function ProfileAvatar({ avatarUrl, onClick }: ProfileAvatarProps) {
  return (
    <div className="flex justify-start -mt-35 mb-3">
      <button
        onClick={onClick}
        className="w-45 h-45 overflow-hidden border-4 border-white dark:border-gray-900 rounded-full bg-white dark:bg-gray-900 group relative hover:opacity-90 transition-opacity"
      >
        <Image
          width={160}
          height={160}
          src={avatarUrl || "/images/user/owner.jpg"}
          alt="user"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg
            className="fill-white"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}