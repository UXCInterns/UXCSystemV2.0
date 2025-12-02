import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import Input from "@/components/form/input/InputField";

interface Props {
  formData: {
    project_name: string;
    progress: number;
  };
  onUpdate: (field: string, value: any) => void;
}

export default function AddProjectBasicInfo({ formData, onUpdate }: Props) {
  return (
    <>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Details
      </h4>

      {/* Project Name */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">
          Project Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.project_name}
          onChange={(e) => onUpdate('project_name', e.target.value)}
          className="flex-1 px-0 border-none shadow-none focus:ring-0 font-medium"
          placeholder="Enter project name"
        />
      </div>

      {/* Status - Display Only */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Status</Label>
        <Badge size="sm" color="light" variant="light">
          Not Started
        </Badge>
      </div>

      {/* Progress - Display Only */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Progress</Label>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300" 
              style={{ width: '0%' }}
            />
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {formData.progress}%
          </span>
        </div>
      </div>
    </>
  );
}