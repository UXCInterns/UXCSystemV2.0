import React from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { CheckCircleIcon } from "@/icons";

interface NotificationProps {
  type?: "success" | "info" | "warning" | "error";
  message: string; // Make message mandatory
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

const Notification: React.FC<NotificationProps> = ({
  type = "info",
  message,
  onClose,
  autoClose = false,
  duration = 5000,
  className = "",
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [key, setKey] = React.useState(0);

  // Reset animation when message or type changes
  React.useEffect(() => {
    setKey(prev => prev + 1);
    setIsVisible(true);
  }, [message, type]);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, key]);

  if (!isVisible) return null;

  const iconConfig = {
    success: {
      icon: CheckCircleIcon,
      bgColor: "bg-success-50 dark:bg-success-500/[0.15]",
      iconColor: "text-success-600 dark:text-success-500",
      borderColor: "bg-green-500",
    },
    info: {
      icon: Info,
      bgColor: "bg-info-50 dark:bg-info-500/[0.15]",
      iconColor: "text-info-600 dark:text-info-500",
      borderColor: "bg-info-500",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-warning-50 dark:bg-warning-500/[0.15]",
      iconColor: "text-warning-600 dark:text-warning-500",
      borderColor: "bg-warning-500",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-error-50 dark:bg-error-500/[0.15]",
      iconColor: "text-error-600 dark:text-error-500",
      borderColor: "bg-error-500",
    },
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`relative w-[350px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className} transition-transform transform-gpu`}
    >
      <div className="flex items-center gap-3 py-3 px-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
          <Icon className={`${config.iconColor}`} size={24}/>
        </div>
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <p className="sm:text-base text-sm text-gray-800 dark:text-white/90">
            {message}
          </p>
          {onClose && (
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/28 bg-gray-200 dark:bg-gray-700">
        <div
          key={key}
          className={`h-full ${config.borderColor}`}
          style={{
            animation: autoClose ? `shrink ${duration}ms linear forwards` : 'none',
            width: autoClose ? '100%' : '0%'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;