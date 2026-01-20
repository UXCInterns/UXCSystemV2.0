import React from "react";
import Button from "@/components/ui/button/Button";

interface FilterFooterProps {
  activeFilterCount: number;
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
}

export const FilterFooter: React.FC<FilterFooterProps> = ({
  activeFilterCount,
  onClear,
  onCancel,
  onApply,
}) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Clear All */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="w-full sm:w-auto px-4 py-2.5"
        >
          Clear All Filters
        </Button>

        {/* Cancel + Apply */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onApply}
            className="w-full sm:w-auto px-4 py-2.5"
          >
            Apply Filters ({activeFilterCount})
          </Button>
        </div>

      </div>
    </div>
  );
};
