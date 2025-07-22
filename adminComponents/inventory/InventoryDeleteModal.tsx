"use client";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { XCircle, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onDeleted?: () => void;
}

const InventoryDeleteModal = ({ isOpen, onClose, itemId, onDeleted }: Props) => {
  const handleDelete = async () => {
    try {
      await axiosWithCsrf.delete(`/api/inventory-items/${itemId}/`);
      onClose();
      if (onDeleted) onDeleted();
    } catch {
      alert("Failed to delete item.");
    }
  };

  if (!isOpen || itemId === null) return null;

  return (
    <div className="fixed w-full h-full inset-0 z-50 bg-black/40 bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Item?</h3>
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this inventory item? This cannot be undone.</p>

        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded border text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDeleteModal;
