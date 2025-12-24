import { UserMetaProfile, SocialLink } from "@/types/UserProfileTypes/UserMeta";

export const formatDisplayText = (value: string | undefined | null, fallback: string = "Not set"): string => {
  return value || fallback;
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getSocialLinks = (profile: UserMetaProfile): SocialLink[] => {
  const links: SocialLink[] = [];
  
  if (profile.facebook_url) {
    links.push({ url: profile.facebook_url, platform: 'facebook' });
  }
  if (profile.twitter_url) {
    links.push({ url: profile.twitter_url, platform: 'twitter' });
  }
  if (profile.linkedin_url) {
    links.push({ url: profile.linkedin_url, platform: 'linkedin' });
  }
  if (profile.instagram_url) {
    links.push({ url: profile.instagram_url, platform: 'instagram' });
  }
  
  return links;
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size should be less than 5MB' };
  }
  
  return { valid: true };
};