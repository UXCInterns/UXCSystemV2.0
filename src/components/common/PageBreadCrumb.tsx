import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // href optional; if no href, render as text (last/current)
}

interface BreadcrumbProps {
  pageTitle: string;
  items: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Page title */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>

      {/* Breadcrumb navigation */}
      <nav>
        <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {!isLast && item.href ? (
                  <>
                    <Link
                      href={item.href}
                      className="inline-flex items-center"
                    >
                      {item.label}
                    </Link>
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <span className="text-gray-800 dark:text-white/90">{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
