type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
};

type Project = {
  project_manager: Profile;
  project_lead: Profile;
  core_team: Profile[];
  support_team: Profile[];
};

export const getAllTeamMembers = (project: Project): Profile[] => {
  const allTeamMembers: Profile[] = [];
  
  if (project.project_manager?.id) {
    allTeamMembers.push(project.project_manager);
  }
  
  if (project.project_lead?.id && 
      !allTeamMembers.find(m => m.id === project.project_lead.id)) {
    allTeamMembers.push(project.project_lead);
  }
  
  if (project.core_team && project.core_team.length > 0) {
    project.core_team.forEach(member => {
      if (member.id && !allTeamMembers.find(m => m.id === member.id)) {
        allTeamMembers.push(member);
      }
    });
  }
  
  if (project.support_team && project.support_team.length > 0) {
    project.support_team.forEach(member => {
      if (member.id && !allTeamMembers.find(m => m.id === member.id)) {
        allTeamMembers.push(member);
      }
    });
  }

  return allTeamMembers;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  if (dateString.includes(',') || dateString === 'Ongoing' || dateString === 'Not set') {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};