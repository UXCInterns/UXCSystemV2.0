import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface ChangeIndicatorProps {
  change: string | null;
}

export const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ change }) => {
  if (!change || change === '0.0') return null;
  
  const isPositive = parseFloat(change) > 0;
  
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ml-2 ${
      isPositive 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400'
    }`}>
      {isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
      {Math.abs(parseFloat(change))}%
    </div>
  );
};