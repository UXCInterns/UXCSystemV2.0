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
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex justify-end space-x-4">
        
        {/* Cancel Button */}
        <Button 
          variant="outline"
          size="md"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>

        {/* Submit Button */}
        <Button 
          variant="primary"
          size="md"
        >
          {submitLabel}
        </Button>

      </div>
    </div>
  );
};

export default FormActions;
