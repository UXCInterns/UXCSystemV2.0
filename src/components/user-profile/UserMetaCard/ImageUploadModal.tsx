import React from "react";
import Image from "next/image";
import { ImageUploadModalProps } from "@/types/UserProfileTypes/UserMeta";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

// Compression utility function
const compressImage = async (file: File, maxSizeBytes: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = document.createElement('img');
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Start with original dimensions
        const width = img.width;
        const height = img.height;
        
        // If image is already small enough, try with original size first
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Function to try compression with a given quality
        const tryCompress = (quality: number): Promise<Blob | null> => {
          return new Promise((resolve) => {
            canvas.toBlob(
              (blob) => resolve(blob),
              'image/jpeg',
              quality
            );
          });
        };
        
        // Binary search for the right quality/size combination
        const findOptimalCompression = async (): Promise<File> => {
          let quality = 0.9;
          let blob = await tryCompress(quality);
          
          // If even at 90% quality it's too large, start reducing dimensions
          if (blob && blob.size > maxSizeBytes) {
            let scale = 1.0;
            
            while (scale > 0.3) { // Don't go below 30% of original size
              scale -= 0.1;
              const newWidth = Math.floor(width * scale);
              const newHeight = Math.floor(height * scale);
              
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              
              // Try with reducing quality
              quality = 0.9;
              while (quality > 0.5) {
                blob = await tryCompress(quality);
                
                if (blob && blob.size <= maxSizeBytes) {
                  const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, '.jpg'),
                    { type: 'image/jpeg' }
                  );
                  return compressedFile;
                }
                
                quality -= 0.1;
              }
            }
          } else if (blob) {
            // Image is small enough at current size, just optimize quality
            while (quality > 0.5 && blob.size <= maxSizeBytes) {
              const testBlob = await tryCompress(quality - 0.05);
              if (testBlob && testBlob.size <= maxSizeBytes) {
                blob = testBlob;
                quality -= 0.05;
              } else {
                break;
              }
            }
            
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg' }
            );
            return compressedFile;
          }
          
          throw new Error('Unable to compress image to required size');
        };
        
        findOptimalCompression()
          .then((compressedFile) => resolve(compressedFile))
          .catch((err) => reject(err));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function ImageUploadModal({
  isOpen,
  onClose,
  imagePreview,
  onFileSelect,
  onSave,
  onEditClick,
  saving,
  fileInputRef,
  title,
  description,
  isAvatar = false
}: ImageUploadModalProps) {
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [compressionStatus, setCompressionStatus] = React.useState<string>("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setCompressionStatus("");

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setIsCompressing(true);
      setCompressionStatus("Compressing image...");
      
      try {
        const compressedFile = await compressImage(file, MAX_FILE_SIZE);
        const compressedSizeKB = (compressedFile.size / 1024).toFixed(2);
        setCompressionStatus(`Compressed to ${compressedSizeKB} KB`);
        
        // Create a new event with the compressed file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(compressedFile);
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            files: dataTransfer.files
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        // Call the original handler with compressed file
        onFileSelect(newEvent);
        
        // Clear status after 3 seconds
        setTimeout(() => setCompressionStatus(""), 3000);
      } catch (error) {
        console.error('Compression failed:', error);
        alert('Failed to compress image. Please try a different image or reduce its size manually.');
      } finally {
        setIsCompressing(false);
      }
    } else {
      // File is already under 1MB, proceed normally
      const sizeKB = (file.size / 1024).toFixed(2);
      setCompressionStatus(`Size: ${sizeKB} KB`);
      onFileSelect(e);
      setTimeout(() => setCompressionStatus(""), 3000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={`${isAvatar ? 'max-w-[500px]' : 'max-w-[700px]'} m-4`}>
      <div className={`relative w-full ${isAvatar ? 'max-w-[500px]' : 'max-w-[700px]'} rounded-2xl bg-white dark:bg-gray-900 p-8`}>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Maximum file size: 1MB (automatically compressed if needed)
          </p>
        </div>
        
        {compressionStatus && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              {compressionStatus}
            </p>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-8">
          <div className={`relative ${isAvatar ? '' : 'w-full max-w-xl'}`}>
            {isAvatar ? (
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-4 border-gray-100 dark:border-gray-600 shadow-xl">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Avatar preview" width={192} height={192} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-56 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-4 border-gray-100 dark:border-gray-600 shadow-xl">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Banner preview" width={640} height={224} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400 dark:text-gray-500">No banner image</p>
                  </div>
                )}
              </div>
            )}
            
            {imagePreview && (
              <button
                onClick={onEditClick}
                className={`absolute ${isAvatar ? 'bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2' : 'bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-black/70 text-white rounded-lg text-sm font-medium backdrop-blur-xs'} shadow-lg transition-colors`}
                title="Edit image"
              >
                <svg className={`${isAvatar ? 'w-5 h-5' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {!isAvatar && <span className="text-sm font-medium">Edit</span>}
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()} 
            className="flex-1"
            disabled={isCompressing}
          >
            {isCompressing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Compressing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {imagePreview ? "Change Image" : "Upload Image"}
              </>
            )}
          </Button>
          {imagePreview && (
            <Button onClick={onSave} disabled={saving || isCompressing} className="flex-1">
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}