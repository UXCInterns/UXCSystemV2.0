import React from "react";
import { SocialLinksProps } from "@/types/UserProfileTypes/UserMeta";
import SocialLinkIcon from "@/components/user-profile/UserMetaCard/SocialLinkIcon";

const defaultPlatforms: Array<'facebook' | 'twitter' | 'linkedin' | 'instagram'> = [
  'facebook',
  'twitter',
  'linkedin',
  'instagram'
];

export default function SocialLinks({ links }: SocialLinksProps) {
  // Create a map of platform to URL
  const linkMap = links.reduce((acc, link) => {
    acc[link.platform] = link.url;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="flex items-center justify-center lg:justify-start gap-2">
      {defaultPlatforms.map((platform) => (
        <SocialLinkIcon
          key={platform}
          url={linkMap[platform] || ''}
          platform={platform}
          disabled={!linkMap[platform]}
        />
      ))}
    </div>
  );
}