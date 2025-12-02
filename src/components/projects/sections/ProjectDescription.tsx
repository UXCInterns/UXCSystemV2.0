import TextArea from "@/components/form/input/TextArea";
import { Project } from "@/types/project";

interface Props {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function ProjectDescription({ project, isEditing, onUpdate }: Props) {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Description
      </h4>
      {isEditing ? (
        <TextArea
          value={project.project_description}
          onChange={(value) => onUpdate({ project_description: value })}
          rows={4}
          placeholder="Enter project description"
        />
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {project.project_description}
        </p>
      )}
    </div>
  );
}