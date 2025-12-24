import { UserInfoProfile } from "@/types/UserProfileTypes/UserInfo";

export const formatDisplayValue = (value: string | undefined | null): string => {
  return value || "Not set";
};

export const formatDate = (dateString: string | number | Date): string => {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "Not set";
  // Basic phone formatting - can be enhanced based on requirements
  return phone;
};

export const isUserInfoComplete = (profile: UserInfoProfile): boolean => {
  return !!(
    profile.first_name &&
    profile.last_name &&
    profile.email &&
    profile.phone &&
    profile.birthday
  );
};

export const hasUserInfoChanges = (
  original: UserInfoProfile,
  updated: UserInfoProfile
): boolean => {
  return (
    original.first_name !== updated.first_name ||
    original.last_name !== updated.last_name ||
    original.email !== updated.email ||
    original.phone !== updated.phone ||
    original.birthday !== updated.birthday
  );
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (value: string): string => {
  return value.trim();
};