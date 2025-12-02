import { Profile } from "@/types/project";
import Checkbox from "@/components/form/input/Checkbox";
import { Modal } from "@/components/ui/modal";
import Avatar from "@/components/ui/avatar/Avatar";

interface Props {
  type: 'core' | 'support';
  profiles: Profile[];
  selectedMembers: string[];
  onToggle: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function TeamMemberModal({ type, profiles, selectedMembers, onToggle, onSave, onClose }: Props) {
  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-md mx-4">
      <div className="flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Manage {type === 'core' ? 'Core' : 'Support'} Team
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select team members to add or remove
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-2">
            {profiles.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                No profiles available
              </p>
            ) : (
              profiles.map(profile => (
                <label 
                  key={profile.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedMembers.includes(profile.id)}
                    onChange={() => onToggle(profile.id)}
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar 
                      src={profile.avatar_url}
                      name={profile.full_name}
                      size="small"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {profile.full_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}