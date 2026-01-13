import Label from "@/components/form/Label";
import DatePicker from "@/components/form/date-picker";
import { Project } from "@/types/project";

interface Props {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

// Format date to "28 August 2025" format
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Convert Date object to YYYY-MM-DD string in local timezone
const dateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ProjectDates({ project, isEditing, onUpdate }: Props) {
  return (
    <>
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Dates
      </h4>
        
      {/* Start Date */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Start Date</Label>
        {isEditing ? (
          <div className="flex-1">
            <DatePicker
              id={`start-date-${project.id}`}
              mode="single"
              defaultDate={project.start_date ? new Date(project.start_date.split('T')[0]) : undefined}
              onChange={(selectedDates) => {
                if (selectedDates.length > 0) {
                  const localDateString = dateToLocalString(selectedDates[0]);
                  onUpdate({ start_date: localDateString });
                }
              }}
              placeholder="Select start date"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-800 dark:text-white">
            {formatDate(project.start_date)}
          </p>
        )}
      </div>

      {/* End Date */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">End Date</Label>
        {isEditing ? (
          <div className="flex-1">
            <DatePicker
              id={`end-date-${project.id}`}
              mode="single"
              defaultDate={project.end_date ? new Date(project.end_date.split('T')[0]) : undefined}
              onChange={(selectedDates) => {
                if (selectedDates.length > 0) {
                  const localDateString = dateToLocalString(selectedDates[0]);
                  onUpdate({ end_date: localDateString });
                }
              }}
              placeholder="Select end date"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-800 dark:text-white">
            {formatDate(project.end_date)}
          </p>
        )}
      </div>
    </>
  );
}