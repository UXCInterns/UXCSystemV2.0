import React from "react";
import Image from "next/image";
import { ImageUploadModalProps } from "@/types/UserProfileTypes/UserMeta";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

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
        </div>
        
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
            onChange={onFileSelect}
            className="hidden"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {imagePreview ? "Change Image" : "Upload Image"}
          </Button>
          {imagePreview && (
            <Button onClick={onSave} disabled={saving} className="flex-1">
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