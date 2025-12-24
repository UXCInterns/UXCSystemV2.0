import React from "react";

export type BadgeVariant = "light" | "solid";
export type BadgeSize = "sm" | "md";
export type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "purple"
  | "cyan"
  | "gray"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "teal";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-1 rounded-full font-medium";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const variants = {
    light: {
      primary: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      light: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      dark: "bg-gray-700 text-white dark:bg-gray-600 dark:text-white",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    },
    solid: {
      primary: "bg-blue-600 text-white dark:bg-blue-500",
      success: "bg-green-600 text-white dark:bg-green-500",
      error: "bg-red-600 text-white dark:bg-red-500",
      warning: "bg-orange-600 text-white dark:bg-orange-500",
      info: "bg-blue-600 text-white dark:bg-blue-500",
      light: "bg-gray-400 text-white dark:bg-gray-500",
      dark: "bg-gray-700 text-white dark:bg-gray-600",
      purple: "bg-purple-600 text-white dark:bg-purple-500",
      cyan: "bg-cyan-600 text-white dark:bg-cyan-500",
      gray: "bg-gray-600 text-white dark:bg-gray-500",
      blue: "bg-blue-600 text-white dark:bg-blue-500",
      green: "bg-emerald-600 text-white dark:bg-emerald-500",
      amber: "bg-amber-600 text-white dark:bg-amber-500",
      red: "bg-red-600 text-white dark:bg-red-500",
      teal: "bg-teal-600 text-white dark:bg-teal-500",
    },
  };

  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </span>
  );
};

export default Badge;
