import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { Project } from "@/types/project";

interface Props {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function ProjectNotes({ project, isEditing, onUpdate }: Props) {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Notes
      </h4>
      {isEditing ? (
        <TextArea
          value={project.notes}
          onChange={(value) => onUpdate({ notes: value })}
          rows={3}
          placeholder="Enter notes"
        />
      ) : (
        <Input
          type="text"
          value={project.notes}
          disabled
          className="cursor-default"
        />
      )}
    </div>
  );
}