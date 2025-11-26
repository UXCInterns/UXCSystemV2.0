import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    const element = document.querySelector(`#${id}`);
    if (!element) return;

    const flatPickr = flatpickr(element as HTMLElement, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "j F Y",
      defaultDate,
      onChange,
      // CRITICAL FIX: Force flatpickr to use local timezone, not UTC
      parseDate: (datestr: string, format: string): Date => {
        // Parse the date string as a local date
        if (typeof datestr === 'string' && datestr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = datestr.split('-').map(Number);
          return new Date(year, month - 1, day);
        }
        // Fallback to default parsing, but ensure it returns a Date
        const parsed = flatpickr.parseDate(datestr, format);
        return parsed || new Date();
      },
    });

    return () => {
      if (flatPickr && !Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}