import React from "react";
import Button from "@/components/ui/button/Button";

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  submitLabel = "Save Visit",
  cancelLabel = "Cancel",
}) => {
  return (
    <div className="border-0 sm:border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex flex-row gap-3 sm:justify-end">
        
        {/* Cancel Button */}
        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </Button>

      </div>
    </div>
  );
};

export default FormActions;
