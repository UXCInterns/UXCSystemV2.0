import Image from "next/image";
import React, { useState } from "react";

interface AvatarProps {
  src?: string | null; // URL of the avatar image
  name: string; // Name for generating initials and alt text
  alt?: string; // Alt text for the avatar
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"; // Avatar size
  status?: "online" | "offline" | "busy" | "none"; // Status indicator
  className?: string; // Additional classes
}

const sizeClasses = {
  xsmall: "h-5 w-5 max-w-5",
  small: "h-6 w-6 max-w-6",
  medium: "h-7 w-7 max-w-7",
  large: "h-8 w-8 max-w-8",
  xlarge: "h-14 w-14 max-w-14",
  xxlarge: "h-16 w-16 max-w-16",
};

const textSizeClasses = {
  xsmall: "text-[10px]",
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
  xlarge: "text-lg",
  xxlarge: "text-xl",
};

const statusSizeClasses = {
  xsmall: "h-1.5 w-1.5 max-w-1.5",
  small: "h-2 w-2 max-w-2",
  medium: "h-2.5 w-2.5 max-w-2.5",
  large: "h-3 w-3 max-w-3",
  xlarge: "h-3.5 w-3.5 max-w-3.5",
  xxlarge: "h-4 w-4 max-w-4",
};

const statusColorClasses = {
  online: "bg-success-500",
  offline: "bg-error-400",
  busy: "bg-warning-500",
};

// Generate a consistent pastel color based on the name
const getColorClass = (name: string) => {
  const colors = [
    "bg-brand-100 text-brand-600",
    "bg-pink-100 text-pink-600",
    "bg-cyan-100 text-cyan-600",
    "bg-orange-100 text-orange-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-yellow-100 text-yellow-600",
    "bg-error-100 text-error-600",
  ];

  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt,
  size = "medium",
  status = "none",
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // If no src or image failed to load, show initials with color
  if (!src || imageError) {
    return (
      <div className={`relative rounded-full ${sizeClasses[size]} ${className}`}>
        <div
          className={`flex items-center justify-center rounded-full w-full h-full ${getColorClass(
            name
          )}`}
        >
          <span className={`font-medium ${textSizeClasses[size]}`}>
            {initials}
          </span>
        </div>

        {/* Status Indicator */}
        {status !== "none" && (
          <span
            className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
              statusSizeClasses[size]
            } ${statusColorClasses[status] || ""}`}
          ></span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-full ${sizeClasses[size]} ${className}`}>
      {/* Avatar Image */}
      <Image
        width="0"
        height="0"
        sizes="100vw"
        src={src}
        alt={alt || name}
        className="object-cover w-full h-full rounded-full"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
      />

      {/* Status Indicator */}
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
            statusSizeClasses[size]
          } ${statusColorClasses[status] || ""}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;