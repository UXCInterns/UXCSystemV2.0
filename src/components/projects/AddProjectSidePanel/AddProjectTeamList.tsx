import Label from "@/components/form/Label";
import Avatar from "@/components/ui/avatar/Avatar";
import { Profile } from "@/types/ProjectsTypes/project";

interface Props {
  label: string;
  teamMembers: Profile[];
  type: 'core' | 'support';
  onOpenTeamModal: (type: 'core' | 'support') => void;
}

export default function AddProjectTeamList({ 
  label, 
  teamMembers, 
  type, 
  onOpenTeamModal 
}: Props) {
  const borderColor = type === 'core' ? 'border-blue-400' : 'border-green-400';
  const textColor = type === 'core' 
    ? 'text-blue-600 dark:text-blue-400' 
    : 'text-green-600 dark:text-green-400';
  const hoverBgColor = type === 'core'
    ? 'hover:bg-blue-50 dark:hover:bg-white/[0.05]'
    : 'hover:bg-green-50 dark:hover:bg-white/[0.05]';

  return (
    <div className="flex items-start">
      <Label className="text-sm w-32 mb-0 pt-1">{label}</Label>
      <div className="flex flex-wrap gap-2 flex-1">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05]"
            >
              <Avatar 
                src={member.avatar_url}
                name={member.full_name}
                size="xsmall"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {member.full_name}
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            No {label.toLowerCase()} members assigned
          </span>
        )}
        <button 
          onClick={() => onOpenTeamModal(type)} 
          className={`flex items-center gap-1 px-2 py-1 rounded-md border border-dashed ${borderColor} ${textColor} text-xs ${hoverBgColor} transition-colors`}
        >
          <span className="text-lg leading-none">+</span>
          Manage Team
        </button>
      </div>
    </div>
  );
}