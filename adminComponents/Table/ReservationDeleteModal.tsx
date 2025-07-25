"use client";
import { useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { X, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
  onDeleted?: (id: number) => void;
}

const ReservationDeleteModal = ({ isOpen, onClose, reservationId, onDeleted }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await axiosWithCsrf.delete(`/api/reservations/${reservationId}/`);
      if (onDeleted) onDeleted(reservationId);
      onClose();
    } catch (err) {
      setError("Failed to delete reservation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center space-x-3">
          <Trash2 className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-bold text-gray-800">Delete Reservation</h2>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Are you sure you want to delete this reservation? This action cannot be undone.
        </p>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDeleteModal;
