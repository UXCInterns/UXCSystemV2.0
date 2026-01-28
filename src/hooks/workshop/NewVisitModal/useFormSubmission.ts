import { useState } from "react";

// Type for API error responses
type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccess = (message: string = "Workshop created successfully!") => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const handleError = (error: unknown) => {
    let errorMsg = "An unexpected error occurred. Please try again.";
    
    // Type guard to check if error matches ApiError structure
    if (error && typeof error === 'object') {
      const apiError = error as ApiError;
      errorMsg = apiError?.response?.data?.message || 
                 apiError?.message || 
                 errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    } else if (typeof error === 'string') {
      errorMsg = error;
    }
    
    setErrorMessage(errorMsg);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return {
    isSubmitting,
    setIsSubmitting,
    showNotification,
    notificationMessage,
    showErrorModal,
    errorMessage,
    handleSuccess,
    handleError,
    closeErrorModal,
    closeNotification,
  };
};