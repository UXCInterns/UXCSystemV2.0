export interface UserMetaProfile {
  full_name: string;
  bio: string;
  role: string;
  job_title: string;
  avatar_url: string;
  banner_url: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
}

export interface UserMetaDisplayProps {
  profile: UserMetaProfile;
  userName: string;
  userProfileImage: string;
  onAvatarClick: () => void;
  onBannerClick: () => void;
}

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagePreview: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onEditClick: () => void;
  saving: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>; // Changed this line
  title: string;
  description: string;
  isAvatar?: boolean;
}

export interface ImageCropperWrapperProps {
  isOpen: boolean;
  tempImage: string;
  onCrop: (croppedImageData: string) => void;
  onCancel: () => void;
  aspectRatio: number;
  isCircular: boolean;
}

export interface SocialLink {
  url: string;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
}

export interface SocialLinksProps {
  links: SocialLink[];
}