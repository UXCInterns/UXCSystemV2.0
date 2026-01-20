import React from "react";

interface DetailsSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default DetailsSection;