import React from "react";

const FormHeader: React.FC = () => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Log New Visit
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Enter the details for the company visit
      </p>
    </div>
  );
};

export default FormHeader;