import { AddressProfile } from "../../types/UserProfileTypes/Address";

export const formatAddressDisplay = (value: string | undefined | null): string => {
  return value || "Not set";
};

export const isAddressComplete = (profile: AddressProfile): boolean => {
  return !!(
    profile.country &&
    profile.city &&
    profile.postal_code &&
    profile.address
  );
};

export const hasAddressChanges = (
  original: AddressProfile,
  updated: AddressProfile
): boolean => {
  return (
    original.country !== updated.country ||
    original.city !== updated.city ||
    original.postal_code !== updated.postal_code ||
    original.address !== updated.address
  );
};

export const sanitizeAddressInput = (value: string): string => {
  return value.trim();
};