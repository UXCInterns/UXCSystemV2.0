import { useState, useRef } from "react";
import { readFileAsDataURL, validateImageFile } from "@/utils/UserProfileUtils/UserMetaCardUtils/UserMetaUtils";

export function useImageUpload(initialImage: string = "") {
  const [preview, setPreview] = useState(initialImage);
  const [tempImage, setTempImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const dataURL = await readFileAsDataURL(file);
      setTempImage(dataURL);
      setShowCropper(true);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read the image file.");
    }
  };

  const handleCrop = (croppedImageData: string) => {
    setPreview(croppedImageData);
    setShowCropper(false);
    setTempImage("");
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImage("");
  };

  const handleEditClick = () => {
    if (preview) {
      setTempImage(preview);
      setShowCropper(true);
    }
  };

  const resetPreview = (url: string) => {
    setPreview(url);
  };

  return {
    preview,
    tempImage,
    showCropper,
    fileInputRef,
    handleFileSelect,
    handleCrop,
    handleCancelCrop,
    handleEditClick,
    resetPreview
  };
}