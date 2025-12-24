import Label from "@/components/form/Label";
import Avatar from "@/components/ui/avatar/Avatar";
import { ChevronDown } from "lucide-react";
import { Profile } from "@/types/ProjectsTypes/project";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface Props {
  label: string;
  selectedProfile: Profile | undefined;
  profiles: Profile[];
  showDropdown: boolean;
  fieldName: string;
  onUpdate: (field: string, value: any) => void;
  onDropdownToggle: () => void;
  onClose: () => void;
}

export default function AddProjectManagerSelector({
  label,
  selectedProfile,
  profiles,
  showDropdown,
  fieldName,
  onUpdate,
  onDropdownToggle,
  onClose
}: Props) {
  return (
    <div className="flex items-center">
      <Label className="text-sm w-32 mb-0">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="relative flex-1">
        <button 
          onClick={onDropdownToggle} 
          className="dropdown-toggle w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <div className="flex items-center gap-2">
            {selectedProfile ? (
              <>
                <Avatar 
                  src={selectedProfile.avatar_url}
                  name={selectedProfile.full_name}
                  size="xsmall"
                />
                <span>{selectedProfile.full_name}</span>
              </>
            ) : (
              <span className="text-gray-500">Select {label.toLowerCase()}</span>
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>
        <Dropdown 
          isOpen={showDropdown} 
          onClose={onClose} 
          className="w-full max-h-64 overflow-auto"
        >
          <DropdownItem
            onClick={() => {
              onUpdate(fieldName, '');
              onClose();
            }}
            baseClassName="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
          </DropdownItem>
          {profiles.map(profile => (
            <DropdownItem
              key={profile.id}
              onClick={() => {
                onUpdate(fieldName, profile.id);
                onClose();
              }}
              baseClassName="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              <Avatar 
                src={profile.avatar_url}
                name={profile.full_name}
                size="xsmall"
              />
              <span className="dark:text-white">{profile.full_name}</span>
            </DropdownItem>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}