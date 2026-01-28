import { Project, Profile } from "@/types/ProjectsTypes/project";
import ProjectBasicInfo from "./ProjectBasicInfo";
import ProjectDates from "./ProjectDates";
import ProjectTeam from "./ProjectTeam";
import ProjectDescription from "./ProjectDescription";
import ProjectNotes from "./ProjectNotes";
import { BadgeColor, BadgeVariant } from "@/components/ui/badge/Badge";

interface Props {
  project: Project;
  isEditing: boolean;
  profiles: Profile[];
  showDropdown: string | null;
  onUpdate: (updates: Partial<Project>) => void;
  onDropdownToggle: (key: string | null) => void;
  onUpdateManager: (id: string, role: 'manager' | 'lead') => void;
  onOpenTeamModal: (type: 'core' | 'support') => void;
  getStatusBadgeProps: (status: string) => {
    color?: BadgeColor;
    variant?: BadgeVariant;
  };
}

export default function ProjectDetailsForm({ 
  project, 
  isEditing, 
  profiles,
  showDropdown,
  onUpdate, 
  onDropdownToggle,
  onUpdateManager,
  onOpenTeamModal,
  getStatusBadgeProps 
}: Props) {
  return (
    <>
      <ProjectBasicInfo
        project={project}
        isEditing={isEditing}
        showDropdown={showDropdown}
        onUpdate={onUpdate}
        onDropdownToggle={onDropdownToggle}
        getStatusBadgeProps={getStatusBadgeProps}
      />

      <ProjectDates
        project={project}
        isEditing={isEditing}
        onUpdate={onUpdate}
      />

      <ProjectTeam
        project={project}
        isEditing={isEditing}
        profiles={profiles}
        showDropdown={showDropdown}
        onDropdownToggle={onDropdownToggle}
        onUpdateManager={onUpdateManager}
        onOpenTeamModal={onOpenTeamModal}
      />

      <ProjectDescription
        project={project}
        isEditing={isEditing}
        onUpdate={onUpdate}
      />

      <ProjectNotes
        project={project}
        isEditing={isEditing}
        onUpdate={onUpdate}
      />
    </>
  );
}