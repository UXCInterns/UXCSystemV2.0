import { ArrowRightIcon } from "@/icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const visiblePages: number[] = [];

  // Always show current page ±1
  const startPage = Math.max(currentPage - 1, 1);
  const endPage = Math.min(currentPage + 2, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  // Add the last 3 pages if not already in view
  const trailingPages = [];
  for (let i = totalPages - 2; i <= totalPages; i++) {
    if (i > endPage && i > 0 && !visiblePages.includes(i)) {
      trailingPages.push(i);
    }
  }

  return (
    <div className="flex justify-between items-center w-full mt-4">
      {/* Previous button */}
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
        >
          <ArrowRightIcon className="transform rotate-180 mr-2" />
          Previous
        </button>
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? "bg-brand-500 text-white"
                : "text-gray-700 dark:text-gray-400"
            } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
          >
            {page}
          </button>
        ))}

        {/* Ellipsis if last 3 pages are not directly after visible pages */}
        {trailingPages.length > 0 && <span className="px-2 dark:text-gray-400">...</span>}

        {/* Render trailing (last 3) pages */}
        {trailingPages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? "bg-brand-500 text-white"
                : "text-gray-700 dark:text-gray-400"
            } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          
          Next
          <ArrowRightIcon className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
