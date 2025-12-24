"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePeriod, Period, PeriodType } from "@/context/PeriodContext";
import { 
  ChevronDownIcon, 
  CalendarIcon, 
  TrendingUpIcon, 
  BarChartIcon, 
  RotateCcwIcon,
  ClockIcon,
  GitCompareIcon,
  XIcon
} from "lucide-react";
import Button from "../ui/button/Button";
import Radio from "../form/input/Radio";
import Select from "../form/Select";
import Label from "../form/Label";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

const PeriodSelector: React.FC = () => {
  const { 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    setPeriod, 
    setComparisonPeriod,
    toggleComparisonMode,
    getPeriodLabel 
  } = usePeriod();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'primary' | 'comparison'>('primary');
  
  // Primary period state
  const [selectedType, setSelectedType] = useState<PeriodType>(currentPeriod.type);
  const [selectedYear, setSelectedYear] = useState(currentPeriod.year);
  const [selectedQuarter, setSelectedQuarter] = useState(currentPeriod.quarter || 1);
  const [customDateRange, setCustomDateRange] = useState<string>("");

  // Comparison period state
  const [comparisonType, setComparisonType] = useState<PeriodType>(comparisonPeriod?.type || 'calendar');
  const [comparisonYear, setComparisonYear] = useState(comparisonPeriod?.year || new Date().getFullYear() - 1);
  const [comparisonQuarter, setComparisonQuarter] = useState(comparisonPeriod?.quarter || 1);
  const [comparisonDateRange, setComparisonDateRange] = useState<string>("");

  // Refs for flatpickr
  const primaryDateRef = useRef<HTMLInputElement | null>(null);
  const comparisonDateRef = useRef<HTMLInputElement | null>(null);

  const currentYear = new Date().getFullYear();
  const startYear = 2021;

  // Initialize custom date ranges from current periods
  useEffect(() => {
    if (currentPeriod.type === 'custom' && currentPeriod.startDate && currentPeriod.endDate) {
      const startDate = new Date(currentPeriod.startDate);
      const endDate = new Date(currentPeriod.endDate);
      const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      setCustomDateRange(`${formatDate(startDate)} to ${formatDate(endDate)}`);
    }
  }, [currentPeriod]);

  useEffect(() => {
    if (comparisonPeriod?.type === 'custom' && comparisonPeriod.startDate && comparisonPeriod.endDate) {
      const startDate = new Date(comparisonPeriod.startDate);
      const endDate = new Date(comparisonPeriod.endDate);
      const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      setComparisonDateRange(`${formatDate(startDate)} to ${formatDate(endDate)}`);
    }
  }, [comparisonPeriod]);

  // Initialize flatpickr for primary custom date range
  useEffect(() => {
    if (selectedType === 'custom' && primaryDateRef.current && activeTab === 'primary') {
      const fp = flatpickr(primaryDateRef.current, {
        mode: "range",
        dateFormat: "d M Y",
        onChange: (selectedDates, dateStr) => {
          setCustomDateRange(dateStr);
        },
        onOpen: () => {
          // Apply theme classes to calendar
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
  }, [selectedType, activeTab, isOpen]);

  // Initialize flatpickr for comparison custom date range
  useEffect(() => {
    if (comparisonType === 'custom' && comparisonDateRef.current && activeTab === 'comparison' && isComparisonMode) {
      const fp = flatpickr(comparisonDateRef.current, {
        mode: "range",
        dateFormat: "d M Y",
        onChange: (selectedDates, dateStr) => {
          setComparisonDateRange(dateStr);
        },
        onOpen: () => {
          // Apply theme classes to calendar
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
  }, [comparisonType, activeTab, isComparisonMode, isOpen]);

  // 📌 Calendar Years (e.g. 2021 → 2026)
  const calendarYears = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  ).map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  // 📌 Financial Years (e.g. FY25/26)
  const financialYears = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  ).map((year) => {
    const short1 = (year % 100).toString().padStart(2, "0");
    const short2 = ((year + 1) % 100).toString().padStart(2, "0");
    return {
      value: year.toString(),
      label: `FY${short1}/${short2}`,
    };
  });

  const quarters = [
    { value: "1", label: "Q1 (Jan-Mar)" },
    { value: "2", label: "Q2 (Apr-Jun)" },
    { value: "3", label: "Q3 (Jul-Sep)" },
    { value: "4", label: "Q4 (Oct-Dec)" },
  ];

  const periodTypes: {
    value: PeriodType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "calendar",
      label: "Calendar Year",
      icon: <CalendarIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />,
    },
    {
      value: "financial",
      label: "Financial Year",
      icon: <TrendingUpIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />,
    },
    {
      value: "quarterly",
      label: "Quarterly",
      icon: <BarChartIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />,
    },
    {
      value: "custom",
      label: "Custom Date Range",
      icon: <ClockIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />,
    },
  ];

  const getCurrentState = (tab: 'primary' | 'comparison') => {
    if (tab === 'primary') {
      return {
        type: selectedType,
        year: selectedYear,
        quarter: selectedQuarter,
        dateRange: customDateRange,
      };
    } else {
      return {
        type: comparisonType,
        year: comparisonYear,
        quarter: comparisonQuarter,
        dateRange: comparisonDateRange,
      };
    }
  };

  const updateState = (tab: 'primary' | 'comparison', field: string, value: any) => {
    if (tab === 'primary') {
      switch (field) {
        case 'type': 
          // Clear custom date range when switching away from custom
          if (selectedType === 'custom' && value !== 'custom') {
            clearDateRange('primary');
          }
          setSelectedType(value); 
          // Auto-sync comparison type when primary type changes
          if (isComparisonMode) {
            // Also clear comparison date range if switching away from custom
            if (comparisonType === 'custom' && value !== 'custom') {
              clearDateRange('comparison');
            }
            setComparisonType(value);
          }
          break;
        case 'year': setSelectedYear(value); break;
        case 'quarter': setSelectedQuarter(value); break;
        case 'dateRange': setCustomDateRange(value); break;
      }
    } else {
      switch (field) {
        case 'type': 
          // Clear comparison date range when switching away from custom
          if (comparisonType === 'custom' && value !== 'custom') {
            clearDateRange('comparison');
          }
          setComparisonType(value); 
          break;
        case 'year': setComparisonYear(value); break;
        case 'quarter': setComparisonQuarter(value); break;
        case 'dateRange': setComparisonDateRange(value); break;
      }
    }
  };

  const parseDateRange = (dateRangeStr: string): { startDate: string; endDate: string } | null => {
    if (!dateRangeStr || !dateRangeStr.includes(' to ')) return null;
    
    const [startStr, endStr] = dateRangeStr.split(' to ');
    
    try {
      // Parse dates in format "27 Aug 2024"
      const parseDate = (dateStr: string) => {
        const parts = dateStr.trim().split(' ');
        if (parts.length !== 3) throw new Error('Invalid date format');
        
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        
        const monthMap: { [key: string]: string } = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        
        const monthNum = monthMap[month];
        if (!monthNum) throw new Error('Invalid month');
        
        return `${year}-${monthNum}-${day.padStart(2, '0')}`;
      };
      
      return {
        startDate: parseDate(startStr),
        endDate: parseDate(endStr)
      };
    } catch (error) {
      console.error('Error parsing date range:', error);
      return null;
    }
  };

  const handleApply = () => {
    const createPeriod = (tab: 'primary' | 'comparison'): Period => {
      const state = getCurrentState(tab);
      const basePeriod: Period = {
        type: state.type,
        year: state.year,
      };

      if (state.type === "quarterly") {
        basePeriod.quarter = state.quarter;
      } else if (state.type === "custom") {
        const parsedDates = parseDateRange(state.dateRange);
        if (parsedDates) {
          basePeriod.startDate = parsedDates.startDate;
          basePeriod.endDate = parsedDates.endDate;
        }
      }

      return basePeriod;
    };

    setPeriod(createPeriod('primary'));

    if (isComparisonMode) {
      setComparisonPeriod(createPeriod('comparison'));
    }

    setIsOpen(false);
    
    // Clear custom date ranges after closing (with slight delay to ensure modal is closed)
    setTimeout(() => {
      setCustomDateRange('');
      setComparisonDateRange('');
      if (primaryDateRef.current) {
        (primaryDateRef.current as any)._flatpickr?.clear();
      }
      if (comparisonDateRef.current) {
        (comparisonDateRef.current as any)._flatpickr?.clear();
      }
    }, 100);
  };

  const handleComparisonToggle = () => {
    if (!isComparisonMode) {
      // When enabling comparison mode, sync the comparison type with primary type
      setComparisonType(selectedType);
    }
    toggleComparisonMode();
  };

  const handleReset = () => {
    const defaultPeriod: Period = {
      type: "calendar",
      year: parseInt(calendarYears[0].value),
    };
    setPeriod(defaultPeriod);
    setComparisonPeriod(undefined);
    setSelectedType("calendar");
    setSelectedYear(parseInt(calendarYears[0].value));
    setSelectedQuarter(1);
    setCustomDateRange('');
    setComparisonDateRange('');
    setIsOpen(false);
  };

  const clearDateRange = (tab: 'primary' | 'comparison') => {
    if (tab === 'primary') {
      setCustomDateRange("");
      if (primaryDateRef.current) {
        (primaryDateRef.current as any)._flatpickr?.clear();
      }
    } else {
      setComparisonDateRange("");
      if (comparisonDateRef.current) {
        (comparisonDateRef.current as any)._flatpickr?.clear();
      }
    }
  };

  const renderPeriodForm = (tab: 'primary' | 'comparison') => {
    const state = getCurrentState(tab);
    const isComparison = tab === 'comparison';
    const dateRef = tab === 'primary' ? primaryDateRef : comparisonDateRef;
    const dateRange = tab === 'primary' ? customDateRange : comparisonDateRange;

    return (
      <div className="space-y-4">
        {/* Period Type */}
        <div>
          <Label>Period Type</Label>
          <div className="space-y-2">
            {periodTypes.map((type) => (
              <Radio
                key={type.value}
                id={`period-${type.value}-${tab}`}
                name={`periodType-${tab}`}
                value={type.value}
                checked={state.type === type.value}
                onChange={(val: string) => updateState(tab, 'type', val as PeriodType)}
                disabled={isComparison && isComparisonMode} // Disable all period types for comparison
                label={
                  <div className={`flex items-center gap-2 ${
                    isComparison && isComparisonMode ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    {type.icon}
                    <span>{type.label}</span>
                    {isComparison && isComparisonMode && (
                      <span className="text-xs text-gray-400 ml-auto">
                        (Auto-synced with primary)
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        {state.type === 'custom' && (
          <div className="space-y-3">
            <Label>Date Range</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={dateRef}
                  value={dateRange}
                  onChange={() => {}}
                  className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2.5 pl-[43px] pr-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Select date range"
                  readOnly
                />
                <div className="pointer-events-none absolute inset-0 left-4 flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {dateRange && (
                <button
                  onClick={() => clearDateRange(tab)}
                  className="px-3 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Year Dropdown */}
        {state.type !== 'custom' && (
          <div>
            <Label>
              {state.type === "financial" ? "Financial Year" : "Year"}
            </Label>
            <div className="relative">
              <Select
                options={state.type === "financial" ? financialYears : calendarYears}
                placeholder="Select Year"
                onChange={(val: string) => updateState(tab, 'year', parseInt(val))}
                className="dark:bg-dark-900"
                value={state.year.toString()}
              />
            </div>
          </div>
        )}

        {/* Quarter Dropdown */}
        {state.type === "quarterly" && (
          <div>
            <Label>Quarter</Label>
            <div className="relative">
              <Select
                options={quarters}
                placeholder="Select Quarter"
                onChange={(val: string) => updateState(tab, 'quarter', parseInt(val))}
                className="dark:bg-dark-900"
                value={state.quarter.toString()}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col lg:flex-row items-center gap-2">
      {/* Main Period Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        size="md" 
        variant="outline" 
        className="flex items-center w-full lg:w-auto"
      >
        <CalendarIcon className="w-4 h-4" />
        <span>{getPeriodLabel()}</span>
        {isComparisonMode && comparisonPeriod && (
          <span className="text-xs text-gray-500 ml-1">
            vs {getPeriodLabel(comparisonPeriod)}
          </span>
        )}
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      <div className="flex flex-row gap-2 w-full lg:w-auto">
        <Button 
          onClick={handleComparisonToggle}
          size="md" 
          variant={isComparisonMode ? "primary" : "outline"}
          className="w-full lg:w-auto"
        >
          <GitCompareIcon className="w-4 h-4" />
          Compare
        </Button>

        {/* Reset Button */}
        <Button 
          onClick={() => {
            handleReset();
            window.location.reload();
          }} 
          size="md" 
          variant="primary" 
          className="w-full lg:w-auto"
        >
          <RotateCcwIcon className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 w-96">
          <div className="p-4 space-y-4">
            {/* Tabs (if comparison mode is enabled) */}
            {isComparisonMode && (
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('primary')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    activeTab === 'primary' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Primary Period
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    activeTab === 'comparison' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Comparison Period
                </button>
                <button
                  onClick={toggleComparisonMode}
                  className="ml-auto p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Disable comparison"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Period Form */}
            {renderPeriodForm(isComparisonMode ? activeTab : 'primary')}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleApply} 
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;