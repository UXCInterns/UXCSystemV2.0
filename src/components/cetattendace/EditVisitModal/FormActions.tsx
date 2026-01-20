import Button from "@/components/ui/button/Button";
import { on } from "events";
import React from "react";

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  submitLabel = "Update Workshop",
}) => {
  return (
    <div className="border-0 border-gray-200 dark:border-gray-700 pt-6 sm:border-t">
      <div className="flex flex-row gap-3 sm:justify-end">
        <div className="flex-1 sm:flex-none">
          <Button 
            variant="outline"
            size="md"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
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