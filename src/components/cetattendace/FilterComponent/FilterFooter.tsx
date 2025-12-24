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
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="px-4 py-2.5"
      >
        Clear All Filters
      </Button>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="px-4 py-2.5"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onApply}
          className="px-4 py-2.5"
        >
          Apply Filters ({activeFilterCount})
        </Button>
      </div>
    </div>
  );
};