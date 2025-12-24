import { Profile } from "@/types/ProjectsTypes/project";
import AddProjectManagerSelector from "./AddProjectManagerSelector";
import AddProjectTeamList from "./AddProjectTeamList";

interface Props {
  formData: {
    project_manager_id: string;
    project_lead_id: string;
  };
  profiles: Profile[];
  showDropdown: string | null;
  coreTeamMembers: string[];
  supportTeamMembers: string[];
  onUpdate: (field: string, value: any) => void;
  onDropdownToggle: (key: string | null) => void;
  onOpenTeamModal: (type: 'core' | 'support') => void;
}

export default function AddProjectTeam({
  formData,
  profiles,
  showDropdown,
  coreTeamMembers,
  supportTeamMembers,
  onUpdate,
  onDropdownToggle,
  onOpenTeamModal
}: Props) {
  const selectedManager = profiles.find(p => p.id === formData.project_manager_id);
  const selectedLead = profiles.find(p => p.id === formData.project_lead_id);
  const coreTeam = profiles.filter(p => coreTeamMembers.includes(p.id));
  const supportTeam = profiles.filter(p => supportTeamMembers.includes(p.id));

  return (
    <>
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Team
      </h4>

      {/* Project Manager */}
      <AddProjectManagerSelector
        label="Project Manager"
        selectedProfile={selectedManager}
        profiles={profiles}
        showDropdown={showDropdown === 'manager'}
        fieldName="project_manager_id"
        onUpdate={onUpdate}
        onDropdownToggle={() => onDropdownToggle(showDropdown === 'manager' ? null : 'manager')}
        onClose={() => onDropdownToggle(null)}
      />

      {/* Project Lead */}
      <AddProjectManagerSelector
        label="Project Lead"
        selectedProfile={selectedLead}
        profiles={profiles}
        showDropdown={showDropdown === 'lead'}
        fieldName="project_lead_id"
        onUpdate={onUpdate}
        onDropdownToggle={() => onDropdownToggle(showDropdown === 'lead' ? null : 'lead')}
        onClose={() => onDropdownToggle(null)}
      />

      {/* Core Team */}
      <AddProjectTeamList
        label="Core Team"
        teamMembers={coreTeam}
        type="core"
        onOpenTeamModal={onOpenTeamModal}
      />

      {/* Support Team */}
      <AddProjectTeamList
        label="Support Team"
        teamMembers={supportTeam}
        type="support"
        onOpenTeamModal={onOpenTeamModal}
      />
    </>
  );
}