/* ───────────────────────────────────────────────────────────────
   ChartTabDropdowns.tsx
   – period & year/custom-range selector used in the chart header
──────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect, useMemo } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

const ChartTabDropdowns: React.FC = () => {
  /* ── state ─────────────────────────────────────────── */
  const [selectedPeriod, setSelectedPeriod] = useState("Calendar Year");
  const [selectedYear, setSelectedYear]     = useState("2025");
  const [dateRange,   setDateRange]         = useState<string>("");

  const [openPeriod, setOpenPeriod] = useState(false);
  const [openYear,   setOpenYear]   = useState(false);

  /* ── refs ──────────────────────────────────────────── */
  const periodRef = useRef<HTMLDivElement>(null);
  const yearRef   = useRef<HTMLDivElement>(null);
  const dpRef     = useRef<HTMLInputElement | null>(null);

  /* ── constants ─────────────────────────────────────── */
  const periodOptions = [
    "Calendar Year",
    "Financial Year",
    "Quarterly",
    "Custom",
  ];
  const isCustom = selectedPeriod === "Custom";

  /* ── dynamic year list ─────────────────────────────── */
  const yearOptions = useMemo(() => {
    const baseYears = [2025, 2024, 2023, 2022];

    if (selectedPeriod === "Calendar Year")
      return baseYears.map(String);

    if (selectedPeriod === "Financial Year")
      return baseYears.map(
        y => `FY${String(y).slice(2)}/${String(y + 1).slice(2)}`
      );

    if (selectedPeriod === "Quarterly")
      return baseYears.flatMap(y => [`Q1 ${y}`, `Q2 ${y}`, `Q3 ${y}`, `Q4 ${y}`]);

    return [];
  }, [selectedPeriod]);

  /* ── sync year when period changes ─────────────────── */
  useEffect(() => {
    if (!isCustom) setSelectedYear(yearOptions[0]);
  }, [selectedPeriod, yearOptions, isCustom]);

  /* ── click-outside to close dropdowns ──────────────── */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node))
        setOpenPeriod(false);
      if (yearRef.current && !yearRef.current.contains(e.target as Node))
        setOpenYear(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* ── init / destroy flatpickr for custom range ─────── */
  useEffect(() => {
    if (isCustom && dpRef.current) {
      const fp = flatpickr(dpRef.current, {
        mode: "range",
        dateFormat: "d M Y",
        onChange: (sel, str) => setDateRange(str),
        onOpen: () => {
          // Make sure the calendar panel follows your theme
          document
            .querySelectorAll(".flatpickr-calendar")
            .forEach(el =>
              el.classList.add(
                "bg-white",
                "dark:bg-gray-800",
                "text-gray-700",
                "dark:text-gray-200"
              )
            );
        },
      });
      return () => fp.destroy();
    }
  }, [isCustom]);

  /* ── generic dropdown component ────────────────────── */
  const Dropdown = ({
    options,
    selected,
    open,
    setOpen,
    setSelected,
    dropdownRef,
  }: {
    options: string[];
    selected: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    setSelected: (v: string) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-theme-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white shadow-theme-xs whitespace-nowrap"
      >
        {selected}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute right-0 z-10 mt-2 w-40 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 max-h-60 overflow-auto">
          {options.map(opt => (
            <li
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md whitespace-nowrap
              ${
                selected === opt
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  /* ── render ─────────────────────────────────────────── */
  return (
    <div className="flex items-center gap-2">
      {/* Period selector */}
      <Dropdown
        options={periodOptions}
        selected={selectedPeriod}
        open={openPeriod}
        setOpen={setOpenPeriod}
        setSelected={setSelectedPeriod}
        dropdownRef={periodRef}
      />

      {/* Year OR Custom range selector */}
      {isCustom ? (
        <div className="relative flex items-center gap-2">
          <div className="relative w-fit">
            <input
              ref={dpRef}
              value={dateRange}
              onChange={() => {}}
              className="datepicker h-10 w-auto rounded-lg border border-gray-200 bg-white py-2.5 pl-[43px] text-theme-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none dark:border-gray-900 dark:bg-gray-900 dark:text-gray-200"
              placeholder="Select dates"
              readOnly
            />
            <div className="pointer-events-none absolute inset-0 left-4 flex items-center">
              {/* calendar icon */}
              <svg
                className="fill-gray-700 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.66683 1.54199C7.08104 1.54199 7.41683 1.87778 7.41683 2.29199V3.00033H12.5835V2.29199C12.5835 1.87778 12.9193 1.54199 13.3335 1.54199C13.7477 1.54199 14.0835 1.87778 14.0835 2.29199V3.00033L15.4168 3.00033C16.5214 3.00033 17.4168 3.89576 17.4168 5.00033V7.50033V15.8337C17.4168 16.9382 16.5214 17.8337 15.4168 17.8337H4.5835C3.47893 17.8337 2.5835 16.9382 2.5835 15.8337V7.50033V5.00033C2.5835 3.89576 3.47893 3.00033 4.5835 3.00033L5.91683 3.00033V2.29199C5.91683 1.87778 6.25262 1.54199 6.66683 1.54199ZM6.66683 4.50033H4.5835C4.30735 4.50033 4.0835 4.72418 4.0835 5.00033V6.75033H15.9168V5.00033C15.9168 4.72418 15.693 4.50033 15.4168 4.50033H13.3335H6.66683ZM15.9168 8.25033H4.0835V15.8337C4.0835 16.1098 4.30735 16.3337 4.5835 16.3337H15.4168C15.693 16.3337 15.9168 16.1098 15.9168 15.8337V8.25033Z"
                />
              </svg>
            </div>
          </div>

          {/* Clear button */}
          {dateRange && (
            <button
              onClick={() => {
                setDateRange("");
                if (dpRef.current) (dpRef.current as any)._flatpickr?.clear();
              }}
              className="px-3 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-theme-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      ) : (
        <Dropdown
          options={yearOptions}
          selected={selectedYear}
          open={openYear}
          setOpen={setOpenYear}
          setSelected={setSelectedYear}
          dropdownRef={yearRef}
        />
      )}
    </div>
  );
};

export default ChartTabDropdowns;
