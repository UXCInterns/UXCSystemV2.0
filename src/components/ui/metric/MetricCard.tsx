import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface MetricCardProps {
  label: string;
  value: string | number;
  colorClass: 'blue' | 'green' | 'purple' | 'amber';
  suffix?: string; // NEW → for units like "hours"
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, colorClass, suffix }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      label: 'text-blue-700 dark:text-blue-300'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'text-green-700 dark:text-green-300'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      label: 'text-purple-700 dark:text-purple-300'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      label: 'text-amber-700 dark:text-amber-300'
    }
  };

  const colors = colorClasses[colorClass];

  return (
    <div className={`${colors.bg} border ${colors.border} p-4 rounded-lg`}>
      <Label className={colors.label}>{label}</Label>
      <Input
        type="text"
        value={suffix ? `${value} ${suffix}` : value}
        disabled={true}
        className="text-2xl font-bold"
      />
    </div>
  );
};

export default MetricCard;
