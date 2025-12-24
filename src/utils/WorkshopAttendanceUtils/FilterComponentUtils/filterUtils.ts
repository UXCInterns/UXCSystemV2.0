import { COURSE_TYPES, BIA_LEVELS, PACE_CATEGORIES } from "@/hooks/workshop/useWorkshopOptions";

export const getDisplayLabel = (category: string, value: string): string => {
  switch (category) {
    case "courseTypes":
      return COURSE_TYPES.includes(value) ? value : value;
    case "categories":
      return PACE_CATEGORIES.includes(value) ? value : value;
    case "biaLevels":
      return BIA_LEVELS.includes(value) ? value : value;
    default:
      return value;
  }
};

export const filterOptions = (
  options: string[],
  searchTerm: string,
  category?: string
) => {
  if (!searchTerm) return options;

  return options.filter((option) => {
    const displayLabel = category ? getDisplayLabel(category, option) : option;
    return displayLabel.toLowerCase().includes(searchTerm.toLowerCase());
  });
};