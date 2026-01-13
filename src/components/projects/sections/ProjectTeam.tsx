import { Project, Profile } from "@/types/project";
import TeamMemberList from "./TeamMemberList";
import ManagerSelector from "./ManagerSelector";

interface Props {
  project: Project;
  isEditing: boolean;
  profiles: Profile[];
  showDropdown: string | null;
  onDropdownToggle: (key: string | null) => void;
  onUpdateManager: (id: string, role: 'manager' | 'lead') => void;
  onOpenTeamModal: (type: 'core' | 'support') => void;
}

export default function ProjectTeam({
  project,
  isEditing,
  profiles,
  showDropdown,
  onDropdownToggle,
  onUpdateManager,
  onOpenTeamModal
}: Props) {
  return (
    <>
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Team
      </h4>

      {/* Project Manager */}
      <ManagerSelector
        label="Project Manager"
        manager={project.project_manager}
        isEditing={isEditing}
        profiles={profiles}
        showDropdown={showDropdown === 'manager'}
        role="manager"
        onDropdownToggle={() => onDropdownToggle(showDropdown === 'manager' ? null : 'manager')}
        onUpdateManager={onUpdateManager}
        onClose={() => onDropdownToggle(null)}
      />

      {/* Project Lead */}
      <ManagerSelector
        label="Project Lead"
        manager={project.project_lead}
        isEditing={isEditing}
        profiles={profiles}
        showDropdown={showDropdown === 'lead'}
        role="lead"
        onDropdownToggle={() => onDropdownToggle(showDropdown === 'lead' ? null : 'lead')}
        onUpdateManager={onUpdateManager}
        onClose={() => onDropdownToggle(null)}
      />

      {/* Core Team */}
      <TeamMemberList
        label="Core Team"
        members={project.core_team}
        isEditing={isEditing}
        type="core"
        onOpenTeamModal={onOpenTeamModal}
      />

      {/* Support Team */}
      <TeamMemberList
        label="Support Team"
        members={project.support_team}
        isEditing={isEditing}
        type="support"
        onOpenTeamModal={onOpenTeamModal}
      />
    </>
  );
}