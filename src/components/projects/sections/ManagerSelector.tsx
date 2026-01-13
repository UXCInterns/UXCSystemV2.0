import Label from "@/components/form/Label";
import Avatar from "@/components/ui/avatar/Avatar";
import { ChevronDown } from "lucide-react";
import { Profile } from "@/types/project";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface Props {
  label: string;
  manager: { 
    id: string;
    name: string; 
    email: string;
    avatar_url?: string | null | undefined;
  };
  isEditing: boolean;
  profiles: Profile[];
  showDropdown: boolean;
  role: 'manager' | 'lead';
  onDropdownToggle: () => void;
  onUpdateManager: (id: string, role: 'manager' | 'lead') => void;
  onClose: () => void;
}

export default function ManagerSelector({
  label,
  manager,
  isEditing,
  profiles,
  showDropdown,
  role,
  onDropdownToggle,
  onUpdateManager,
  onClose
}: Props) {
  return (
    <div className="flex items-center">
      <Label className="text-sm w-32 mb-0">{label}</Label>
      {isEditing ? (
        <div className="relative flex-1">
          <button 
            onClick={onDropdownToggle} 
            className="dropdown-toggle w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <div className="flex items-center gap-2">
              <Avatar 
                src={manager.avatar_url}
                name={manager.name}
                size="xsmall"
              />
              <span>{manager.name}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
          <Dropdown 
            isOpen={showDropdown} 
            onClose={onClose} 
            className="w-full max-h-64 overflow-auto"
          >
            {profiles.map(profile => (
              <DropdownItem
                key={profile.id}
                onClick={() => {
                  onUpdateManager(profile.id, role);
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
      ) : (
        <div className="flex items-center gap-2">
          <Avatar 
            src={manager.avatar_url}
            name={manager.name}
            size="small"
          />
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {manager.name}
          </p>
        </div>
      )}
    </div>
  );
}