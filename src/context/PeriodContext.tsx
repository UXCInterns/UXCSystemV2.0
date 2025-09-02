"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PeriodType = 'calendar' | 'financial' | 'quarterly' | 'custom';

export interface Period {
  type: PeriodType;
  year: number;
  quarter?: number; // Only for quarterly type
  startDate?: string; // Only for custom type (ISO date string)
  endDate?: string; // Only for custom type (ISO date string)
}

export interface PeriodRange {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ComparisonPeriods {
  primary: Period;
  comparison?: Period;
}

interface PeriodContextType {
  currentPeriod: Period;
  comparisonPeriod?: Period;
  isComparisonMode: boolean;
  setPeriod: (period: Period) => void;
  setComparisonPeriod: (period: Period | undefined) => void;
  toggleComparisonMode: () => void;
  getPeriodRange: (period?: Period) => PeriodRange;
  getPeriodLabel: (period?: Period) => string;
  getComparisonPeriods: () => ComparisonPeriods;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
};

interface PeriodProviderProps {
  children: ReactNode;
}

export const PeriodProvider: React.FC<PeriodProviderProps> = ({ children }) => {
  const [currentPeriod, setCurrentPeriod] = useState<Period>({
    type: 'calendar',
    year: new Date().getFullYear(),
  });

  const [comparisonPeriod, setComparisonPeriodState] = useState<Period | undefined>();
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  const setPeriod = (period: Period) => {
    setCurrentPeriod(period);
  };

  const setComparisonPeriod = (period: Period | undefined) => {
    setComparisonPeriodState(period);
    if (period) {
      setIsComparisonMode(true);
    }
  };

  const toggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode);
    if (isComparisonMode) {
      setComparisonPeriodState(undefined);
    }
  };

  const getPeriodRange = (period?: Period): PeriodRange => {
    const targetPeriod = period || currentPeriod;
    const { type, year, quarter, startDate, endDate } = targetPeriod;

    switch (type) {
      case 'calendar':
        return {
          startDate: `${year}-01-01`,
          endDate: `${year}-12-31`,
        };

      case 'financial':
        // Assuming financial year starts April 1st (adjust as needed)
        return {
          startDate: `${year}-04-01`,
          endDate: `${year + 1}-03-31`,
        };

      case 'quarterly':
        if (!quarter) throw new Error('Quarter is required for quarterly period');

        const quarterStartMonth = (quarter - 1) * 3 + 1;
        const quarterEndMonth = quarter * 3;

        // Get last day of the quarter end month
        const lastDay = new Date(year, quarterEndMonth, 0).getDate();

        return {
          startDate: `${year}-${quarterStartMonth.toString().padStart(2, '0')}-01`,
          endDate: `${year}-${quarterEndMonth.toString().padStart(2, '0')}-${lastDay}`,
        };

      case 'custom':
        if (!startDate || !endDate) {
          throw new Error('Start date and end date are required for custom period');
        }
        return {
          startDate,
          endDate,
        };

      default:
        throw new Error('Invalid period type');
    }
  };

  const getPeriodLabel = (period?: Period): string => {
    const targetPeriod = period || currentPeriod;
    const { type, year, quarter, startDate, endDate } = targetPeriod;

    switch (type) {
      case 'calendar':
        return `Calendar Year ${year}`;

      case 'financial':
        return `FY ${year}-${(year + 1).toString().slice(-2)}`;

      case 'quarterly':
        return `Q${quarter} ${year}`;

      case 'custom':
        if (!startDate || !endDate) return 'Custom Range';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startFormatted = start.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        const endFormatted = end.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        return `${startFormatted} - ${endFormatted}`;

      default:
        return 'Unknown Period';
    }
  };

  const getComparisonPeriods = (): ComparisonPeriods => {
    return {
      primary: currentPeriod,
      comparison: isComparisonMode ? comparisonPeriod : undefined,
    };
  };

  const value: PeriodContextType = {
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
    setPeriod,
    setComparisonPeriod,
    toggleComparisonMode,
    getPeriodRange,
    getPeriodLabel,
    getComparisonPeriods,
  };

  return (
    <PeriodContext.Provider value={value}>
      {children}
    </PeriodContext.Provider>
  );
};