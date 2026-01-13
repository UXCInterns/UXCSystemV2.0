import { useEffect, useRef, useState } from 'react';
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

// ✅ Move helper above useState
const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(
    defaultDate
      ? typeof defaultDate === 'string'
        ? defaultDate
        : Array.isArray(defaultDate)
          ? (defaultDate as Date[]).map(d => formatDate(d)).join(', ')
          : formatDate(defaultDate as Date)
      : ''
  );

  useEffect(() => {
    const flatPickr = flatpickr(inputRef.current!, {
      mode: mode || 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'j F Y',
      defaultDate,
      onChange: (selectedDates, dateStr, instance) => {
        setValue(dateStr); // update displayed value

        // call user onChange if provided
        if (onChange) {
          if (Array.isArray(onChange)) {
            onChange.forEach(fn => fn(selectedDates, dateStr, instance));
          } else {
            onChange(selectedDates, dateStr, instance);
          }
        }
      },
    });

    return () => {
      if (flatPickr && !Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}