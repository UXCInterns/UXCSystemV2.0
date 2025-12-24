import React from "react";
import { X, Check } from "lucide-react";

interface TaskPanelHeaderProps {
  title: string;
  onSave: () => void;
  onClose: () => void;
  loading?: boolean;
}

export default function AddTaskPanelHeader({
  title,
  onSave,
  onClose,
  loading = false
}: TaskPanelHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05] flex items-center justify-between">
      <h3 className="text-md font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={loading}
          className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors disabled:opacity-50"
          title="Save"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}