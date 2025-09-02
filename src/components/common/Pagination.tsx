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

  if (totalPages <= 7) {
    // Show all if small number of pages
    for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
  } else if (currentPage <= 5) {
    // Case: First 5 pages visible + last page
    for (let i = 1; i <= 5; i++) visiblePages.push(i);
    visiblePages.push(totalPages);
  } else {
    // Case: Show first page + last 5 pages
    visiblePages.push(1);
    for (let i = totalPages - 4; i <= totalPages; i++) {
      visiblePages.push(i);
    }
  }

  return (
    <div className="flex justify-between items-center w-full p-4 border-t border-gray-200 dark:border-white/[0.05]">
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
        {visiblePages.map((page, index) => {
          const prev = visiblePages[index - 1];
          const showEllipsis = prev && page - prev > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis && <span className="px-2 dark:text-gray-400">...</span>}
              <button
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 dark:text-gray-400"
                } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
              >
                {page}
              </button>
            </div>
          );
        })}
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
