import Label from "@/components/form/Label";
import DatePicker from "@/components/form/date-picker";

const dateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface Props {
  formData: {
    start_date: string;
    end_date: string;
  };
  onUpdate: (field: string, value: string | number) => void;
}

export default function AddProjectDates({ onUpdate }: Props) {
  return (
    <>
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Dates
      </h4>

      {/* Start Date */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">
          Start Date <span className="text-red-500">*</span>
        </Label>
        <div className="flex-1">
          <DatePicker
            id="new-project-start-date"
            mode="single"
            onChange={(selectedDates) => {
              if (selectedDates.length > 0) {
                onUpdate('start_date', dateToLocalString(selectedDates[0]));
              }
            }}
            placeholder="Select start date"
          />
        </div>
      </div>

      {/* End Date */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">
          End Date <span className="text-red-500">*</span>
        </Label>
        <div className="flex-1">
          <DatePicker
            id="new-project-end-date"
            mode="single"
            onChange={(selectedDates) => {
              if (selectedDates.length > 0) {
                onUpdate('end_date', dateToLocalString(selectedDates[0]));
              }
            }}
            placeholder="Select end date"
          />
        </div>
      </div>
    </>
  );
}