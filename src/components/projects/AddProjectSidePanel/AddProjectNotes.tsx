import TextArea from "@/components/form/input/TextArea";

interface Props {
  value: string;
  onUpdate: (field: string, value: string | number) => void;
}

export default function AddProjectNotes({ value, onUpdate }: Props) {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Notes
      </h4>
      <TextArea
        value={value}
        onChange={(val) => onUpdate('notes', val)}
        rows={3}
        placeholder="Enter notes"
      />
    </div>
  );
}