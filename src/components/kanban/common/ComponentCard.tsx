import React from "react";

interface ComponentCardProps {
  title?: string;
  desc?: string;
  className?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  desc = "",
  className = "",
  children,
  header,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="py-4">
        {header ? (
          header
        ) : (
          <>
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            {desc && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            )}
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
