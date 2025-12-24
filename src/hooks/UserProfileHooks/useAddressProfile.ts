import { useState, useEffect } from "react";
import { AddressProfile } from "../../types/UserProfileTypes/Address";

export function useAddressProfile(userId: string | null) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AddressProfile>({
    country: "",
    city: "",
    postal_code: "",
    address: ""
  });
  const [formData, setFormData] = useState<AddressProfile>({
    country: "",
    city: "",
    postal_code: "",
    address: ""
  });

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profiles?id=${userId}`);
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
        setFormData(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    if (!userId) return false;
    
    setSaving(true);
    try {
      const response = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          ...formData
        }),
      });

      const data = await response.json();

      if (response.ok && data.profile) {
        setProfile(data.profile);
        return true;
      } else {
        console.error("Failed to save changes:", data.error);
        alert("Failed to save changes. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const resetFormData = () => {
    setFormData(profile);
  };

  return {
    loading,
    saving,
    profile,
    formData,
    handleInputChange,
    saveProfile,
    resetFormData
  };
}