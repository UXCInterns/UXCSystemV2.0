import React from "react";
import { Modal } from "@/components/ui/modal/index";

interface ErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  errorMessage,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 dark:bg-error-500/[0.15] rounded-full mb-4">
          <svg className="w-6 h-6 text-error-600 dark:text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
          Error Creating Workshop
        </h3>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          {errorMessage}
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-error-600 rounded-lg hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};