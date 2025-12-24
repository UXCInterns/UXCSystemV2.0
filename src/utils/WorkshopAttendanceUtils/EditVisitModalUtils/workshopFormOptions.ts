import { PROGRAM_TYPES, COURSE_TYPES, BIA_LEVELS, PACE_CATEGORIES } from "@/hooks/workshop/useWorkshopOptions";

export const PROGRAM_TYPE_OPTIONS = PROGRAM_TYPES.map(type => ({
  value: type.toLowerCase().replace("-", "_"),
  label: type
}));

export const BIA_LEVEL_OPTIONS = BIA_LEVELS.map(level => ({
  value: level,
  label: level
}));

export const COURSE_TYPE_OPTIONS = COURSE_TYPES.map(type => ({
  value: type,
  label: type
}));

export const PACE_CATEGORY_OPTIONS = PACE_CATEGORIES.map(category => ({
  value: category,
  label: category
}));

