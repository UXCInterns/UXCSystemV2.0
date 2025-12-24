import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";

interface FilterSectionProps {
  title: string;
  description: string;
  options: string[];
  selectedValues: string[];
  onCheckboxChange: (value: string, checked: boolean) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  description,
  options,
  selectedValues,
  onCheckboxChange,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
}) => {
  const filterOptions = (opts: string[], search: string) => {
    if (!search) return opts;
    return opts.filter(option => 
      option.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredOptions = filterOptions(options, searchTerm);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        {showSearch && onSearchChange && (
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mb-3"
          />
        )}
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {filteredOptions.map(option => (
            <Checkbox
              key={option}
              label={option}
              checked={selectedValues.includes(option)}
              onChange={(checked) => onCheckboxChange(option, checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;