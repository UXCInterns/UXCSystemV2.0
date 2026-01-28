import TextArea from "@/components/form/input/TextArea";

interface Props {
  value: string;
  onUpdate: (field: string, value: string | number) => void;
}

export default function AddProjectDescription({ value, onUpdate }: Props) {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Description
      </h4>
      <TextArea
        value={value}
        onChange={(val) => onUpdate('project_description', val)}
        rows={4}
        placeholder="Enter project description"
      />
    </div>
  );
}