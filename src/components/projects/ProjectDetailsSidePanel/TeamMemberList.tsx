import Label from "@/components/form/Label";
import Avatar from "@/components/ui/avatar/Avatar";
import { TeamMember } from "@/types/ProjectsTypes/project";

interface Props {
  label: string;
  members: (TeamMember | string)[];
  isEditing: boolean;
  type: 'core' | 'support';
  onOpenTeamModal: (type: 'core' | 'support') => void;
}

const renderTeamMember = (member: TeamMember | string, idx: number, type: 'core' | 'support') => {
  const memberName = typeof member === 'string' ? member : member.name;
  const memberAvatar = typeof member === 'string' ? null : member.avatar_url;
  const memberId = typeof member === 'string' ? `${type}-${idx}` : member.id;

  return (
    <div 
      key={memberId} 
      className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05]"
    >
      <Avatar 
        src={memberAvatar}
        name={memberName}
        size="xsmall"
      />
      <span className="text-xs text-gray-700 dark:text-gray-300">
        {memberName}
      </span>
    </div>
  );
};

export default function TeamMemberList({ 
  label, 
  members, 
  isEditing, 
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
        {members && members.length > 0 ? (
          members.map((member, idx) => renderTeamMember(member, idx, type))
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            No {label.toLowerCase()} members assigned
          </span>
        )}
        {isEditing && (
          <button 
            onClick={() => onOpenTeamModal(type)} 
            className={`flex items-center gap-1 px-2 py-1 rounded-md border border-dashed ${borderColor} ${textColor} text-xs ${hoverBgColor} transition-colors`}
          >
            <span className="text-lg leading-none">+</span>
            Manage Team
          </button>
        )}
      </div>
    </div>
  );
}