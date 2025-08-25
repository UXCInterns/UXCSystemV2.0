"use client";

import React, { useState } from "react";
import { usePeriod, Period, PeriodType } from "@/context/PeriodContext";
import { ChevronDownIcon, CalendarIcon, TrendingUpIcon, BarChartIcon, RotateCcwIcon} from "lucide-react";
import Button from "../ui/button/Button";
import Radio from "../form/input/Radio";
import Select from "../form/Select"; // ✅ Your custom Select
import Label from "../form/Label";

const PeriodSelector: React.FC = () => {
  const { currentPeriod, setPeriod, getPeriodLabel } = usePeriod();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PeriodType>(
    currentPeriod.type
  );
  const [selectedYear, setSelectedYear] = useState(currentPeriod.year);
  const [selectedQuarter, setSelectedQuarter] = useState(
    currentPeriod.quarter || 1
  );

  const currentYear = new Date().getFullYear();
  const startYear = 2021;

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
      icon: (
        <CalendarIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ),
    },
    {
      value: "financial",
      label: "Financial Year",
      icon: (
        <TrendingUpIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ),
    },
    {
      value: "quarterly",
      label: "Quarterly",
      icon: (
        <BarChartIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ),
    },
  ];

  const handleApply = () => {
    const newPeriod: Period = {
      type: selectedType,
      year: selectedYear,
      ...(selectedType === "quarterly" && { quarter: selectedQuarter }),
    };
    setPeriod(newPeriod);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultPeriod: Period = {
      type: "calendar",
      year: parseInt(calendarYears[0].value),
    };
    setPeriod(defaultPeriod);
    setSelectedType("calendar");
    setSelectedYear(parseInt(calendarYears[0].value));
    setSelectedQuarter(1);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Dropdown Button */}
      <Button onClick={() => setIsOpen(!isOpen)} size="sm" variant="outline" className="flex items-center rounded-lg">
        <CalendarIcon className="w-4 h-4" />
        <span>{getPeriodLabel()}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${ isOpen ? "rotate-180" : ""}`}/>
      </Button>

      {/* Reset Button */}
      <Button onClick={handleReset} size="sm" variant="primary" className="px-4 rounded-lg border border-brand-500">
        <RotateCcwIcon className="size-5" />Reset
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 w-80">
          <div className="p-4 space-y-4">
            {/* Period Type */}
            <div>
              <Label>Period Type</Label>
              <div className="space-y-2">
                {periodTypes.map((type) => (
                  <Radio
                    key={type.value}
                    id={`period-${type.value}`}
                    name="periodType"
                    value={type.value}
                    checked={selectedType === type.value}
                    onChange={(val: string) =>
                      setSelectedType(val as PeriodType)
                    }
                    label={
                      <div className="flex items-center gap-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

            {/* Year Dropdown */}
            <div>
              <Label>
                {selectedType === "financial" ? "Financial Year" : "Year"}
              </Label>
              <div className="relative">
                <Select
                  options={
                    selectedType === "financial"
                      ? financialYears
                      : calendarYears
                  }
                  placeholder="Select Year"
                  onChange={(val: string) => setSelectedYear(parseInt(val))}
                  className="dark:bg-dark-900"
                  value={selectedYear.toString()}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Quarter Dropdown */}
            {selectedType === "quarterly" && (
              <div>
                <Label>Quarter</Label>
                <div className="relative">
                  <Select
                    options={quarters}
                    placeholder="Select Quarter"
                    onChange={(val: string) =>
                      setSelectedQuarter(parseInt(val))
                    }
                    className="dark:bg-dark-900"
                    value={selectedQuarter.toString()}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1"> Cancel</Button>
              <Button variant="primary" onClick={handleApply} className="flex-1"> Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;