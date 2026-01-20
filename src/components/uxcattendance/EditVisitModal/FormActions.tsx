import React from "react";
import Button from "@/components/ui/button/Button";

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  submitLabel = "Submit",
  cancelLabel = "Cancel"
}) => {
  return (
    <div className="border-0 border-gray-200 dark:border-gray-700 pt-6 sm:border-t">
      <div className="flex flex-row gap-3 sm:justify-end">
        
        {/* Cancel Button */}
        <div className="flex-1 sm:flex-none">
          <Button 
            variant="outline"
            size="md"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
        </div>

        {/* Submit Button */}
        <div className="flex-1 sm:flex-none">
          <Button 
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
          >
            {submitLabel}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default FormActions;
