import React from "react";

interface FormHeaderProps {
  title?: string;
  description?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title = "Edit Workshop",
  description = "Update the details for this workshop"
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  );
};