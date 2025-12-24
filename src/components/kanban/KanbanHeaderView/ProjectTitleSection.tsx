import React from 'react';
import { BackButton } from './BackButton';

interface ProjectTitleSectionProps {
  projectName: string;
  onBack: () => void;
}

export const ProjectTitleSection: React.FC<ProjectTitleSectionProps> = ({ 
  projectName, 
  onBack 
}) => {
  return (
    <div className="flex flex-col items-start w-[20%]">
      <BackButton onClick={onBack} />
      <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
        {projectName}
      </h1>
    </div>
  );
};