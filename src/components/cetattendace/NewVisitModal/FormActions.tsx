import React from "react";
import Button from "@/components/ui/button/Button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel?: string;
  submittingLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel,
  submitLabel = "Create Workshop",
  submittingLabel = "Creating...",
}) => {
  return (
    <div className="border-0 sm:border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex flex-row gap-3 sm:justify-end">
        
        {/* Cancel */}
        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        {/* Submit */}
        <Button
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>

      </div>
    </div>
  );
};
