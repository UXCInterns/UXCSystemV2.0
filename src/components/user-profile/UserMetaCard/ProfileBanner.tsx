import React from "react";
import Image from "next/image";
import { PencilIcon } from "@/icons";

interface ProfileBannerProps {
  bannerUrl: string;
  onEdit: () => void;
}

export default function ProfileBanner({ bannerUrl, onEdit }: ProfileBannerProps) {
  return (
    <div className="h-60 bg-gradient-to-r from-blue-500 to-purple-600 relative group">
      {bannerUrl && (
        <Image
          src={bannerUrl}
          alt="banner"
          fill
          className="object-cover"
        />
      )}
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-black/70 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-xs"
      >
        <PencilIcon />
        Edit Banner
      </button>
    </div>
  );
}