import React from "react";
import Notification from "@/components/ui/notification/Notification";

interface SuccessNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  show,
  message,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4" style={{ zIndex: 999999 }}>
      <Notification
        type="success"
        message={message}
        onClose={onClose}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
};