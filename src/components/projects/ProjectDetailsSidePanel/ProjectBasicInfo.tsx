import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import Input from "@/components/form/input/InputField";
import { ChevronDown } from "lucide-react";
import { Project } from "@/types/ProjectsTypes/project";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface Props {
  project: Project;
  isEditing: boolean;
  showDropdown: string | null;
  onUpdate: (updates: Partial<Project>) => void;
  onDropdownToggle: (key: string | null) => void;
  getStatusBadgeProps: (status: string) => any;
}

const STATUS_OPTIONS = [
  'Not Started',
  'In Progress',
  'On Hold',
  'Completed',
  'Cancelled'
];

export default function ProjectBasicInfo({
  project,
  isEditing,
  showDropdown,
  onUpdate,
  onDropdownToggle,
  getStatusBadgeProps
}: Props) {
  return (
    <>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Details
      </h4>

      {/* Project Name */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Project Name</Label>
        {isEditing ? (
          <Input
            type="text"
            value={project.project_name}
            onChange={(e) => onUpdate({ project_name: e.target.value })}
            className="flex-1 px-0 border-none shadow-none focus:ring-0 font-medium"
            placeholder="Enter project name"
          />
        ) : (
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {project.project_name}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Status</Label>
        {isEditing ? (
          <div className="relative flex-1">
            <button 
              onClick={() => onDropdownToggle(showDropdown === 'status' ? null : 'status')} 
              className="dropdown-toggle px-3 py-1.5 text-sm border border-gray-300 rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <Badge size="sm" {...getStatusBadgeProps(project.status)}>
                {project.status}
              </Badge>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            <Dropdown isOpen={showDropdown === 'status'} onClose={() => onDropdownToggle(null)} className="w-full max-h-64 overflow-auto">
              {STATUS_OPTIONS.map(status => (
                <DropdownItem
                  key={status}
                  onClick={() => {
                    onUpdate({ status });
                    onDropdownToggle(null);
                  }}
                  baseClassName="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Badge size="sm" {...getStatusBadgeProps(status)}>
                    {status}
                  </Badge>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        ) : (
          <Badge size="sm" {...getStatusBadgeProps(project.status)}>
            {project.status}
          </Badge>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Progress</Label>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300" 
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {project.progress}%
          </span>
        </div>
      </div>
    </>
  );
}