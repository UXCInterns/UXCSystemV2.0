import { useState } from "react";

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

  const handleError = (error: any) => {
    const errorMsg = error?.response?.data?.message || 
                    error?.message || 
                    "An unexpected error occurred. Please try again.";
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
