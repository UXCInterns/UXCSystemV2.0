import React from 'react';
import Avatar from '@/components/ui/avatar/Avatar';
import type { TeamMember } from '@/types/ProjectsTypes/project';

interface TeamMembersSectionProps {
  teamMembers: TeamMember[];
  maxVisible?: number;
}

export const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({ 
  teamMembers,
  maxVisible = 5
}) => {
  return (
    <div className="flex flex-col text-xs text-gray-400 uppercase tracking-wide w-[20%]">
      <span className="mb-1">People on Project</span>
      <div className="flex items-center mt-1">
        {teamMembers.length > 0 ? (
          <div className="flex -space-x-2">
            {teamMembers.slice(0, maxVisible).map((member) => (
              <div
                key={member.id ?? member.email}
                className="relative group"
                title={`${member.name} (${member.email})`}
              >
                <Avatar
                  src={member.avatar_url}
                  name={member.name}
                  size="medium"
                  className="hover:scale-110 transition-transform cursor-pointer"
                />
              </div>
            ))}
            {teamMembers.length > maxVisible && (
              <div
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-200 text-xs font-semibold"
                title={`${teamMembers.length - maxVisible} more team members`}
              >
                +{teamMembers.length - maxVisible}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No team members</p>
        )}
      </div>
    </div>
  );
};