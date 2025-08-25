"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PeriodType = 'calendar' | 'financial' | 'quarterly';

export interface Period {
  type: PeriodType;
  year: number;
  quarter?: number; // Only for quarterly type
}

export interface PeriodRange {
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
}

interface PeriodContextType {
  currentPeriod: Period;
  setPeriod: (period: Period) => void;
  getPeriodRange: () => PeriodRange;
  getPeriodLabel: () => string;
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

  const setPeriod = (period: Period) => {
    setCurrentPeriod(period);
  };

  const getPeriodRange = (): PeriodRange => {
    const { type, year, quarter } = currentPeriod;

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
      
      default:
        throw new Error('Invalid period type');
    }
  };

  const getPeriodLabel = (): string => {
    const { type, year, quarter } = currentPeriod;

    switch (type) {
      case 'calendar':
        return `Calendar Year ${year}`;
      
      case 'financial':
        return `FY ${year}-${(year + 1).toString().slice(-2)}`;
      
      case 'quarterly':
        return `Q${quarter} ${year}`;
      
      default:
        return 'Unknown Period';
    }
  };

  const value: PeriodContextType = {
    currentPeriod,
    setPeriod,
    getPeriodRange,
    getPeriodLabel,
  };

  return (
    <PeriodContext.Provider value={value}>
      {children}
    </PeriodContext.Provider>
  );
};

