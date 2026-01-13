// components/modals/ConfirmDeleteModal.tsx
interface ConfirmDeleteModalProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  title = "Delete session?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-red-600">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
