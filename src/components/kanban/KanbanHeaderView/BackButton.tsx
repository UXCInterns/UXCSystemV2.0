import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label = 'Back to Projects' 
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-sm mb-1.5"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};