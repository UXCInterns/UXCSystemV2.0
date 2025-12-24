import { useState, useEffect } from 'react';
import { Profile } from "@/types/ProjectsTypes/project";
import Checkbox from "@/components/form/input/Checkbox";
import { Modal } from "@/components/ui/modal";
import Avatar from "@/components/ui/avatar/Avatar";

interface Props {
  profiles: Profile[];
  selectedAssignees: string[];
  projectMembers?: string[]; // Array of user IDs who are part of the project
  onToggle: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function AssigneesModal({ 
  profiles, 
  selectedAssignees, 
  projectMembers,
  onToggle, 
  onSave, 
  onClose 
}: Props) {
  // Local state to track temporary selections
  const [localSelectedAssignees, setLocalSelectedAssignees] = useState<string[]>(selectedAssignees);

  // Reset local state when modal opens with new selectedAssignees
  useEffect(() => {
    setLocalSelectedAssignees(selectedAssignees);
  }, [selectedAssignees]);

  // Filter profiles to only show project members
  const availableProfiles = projectMembers 
    ? profiles.filter(profile => projectMembers.includes(profile.id))
    : profiles;

  const handleToggle = (profileId: string) => {
    setLocalSelectedAssignees(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSave = () => {
    // Sync all changes to parent's selectedAssignees state
    const removed = selectedAssignees.filter(id => !localSelectedAssignees.includes(id));
    const added = localSelectedAssignees.filter(id => !selectedAssignees.includes(id));
    
    // Apply all changes at once
    removed.forEach(id => onToggle(id));
    added.forEach(id => onToggle(id));
    
    // Call parent's onSave to persist to database
    onSave();
  };

  const handleClose = () => {
    // Reset to original state and close
    setLocalSelectedAssignees(selectedAssignees);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={handleClose} className="max-w-md mx-4">
      <div className="flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Manage Task Assignees
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select team members to assign to this task
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-2">
            {availableProfiles.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                No team members available in this project
              </p>
            ) : (
              availableProfiles.map(profile => (
                <label 
                  key={profile.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={localSelectedAssignees.includes(profile.id)}
                    onChange={() => handleToggle(profile.id)}
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar 
                      src={profile.avatar_url}
                      name={profile.full_name || profile.email}
                      size="small"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {profile.full_name || 'Unknown User'}
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
            onClick={handleClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}