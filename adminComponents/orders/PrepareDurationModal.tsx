"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

interface PrepareDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  onPrepared: () => void;
  showNotification: (type: "success" | "error", message: string) => void;
}

const durations = [5, 10, 15, 20, 30, 45, 60];

const PrepareDurationModal: React.FC<PrepareDurationModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onPrepared,
  showNotification,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await axiosWithCsrf.post(
        `/api/admin/orders/${orderId}/update-status/`,
        {
          status: "preparing",
          prepare_duration: selectedDuration,
        }
      );
      showNotification("success", response.data.message);
      onPrepared(); // e.g. update order status in parent
      onClose();
    } catch (err: any) {
      showNotification(
        "error",
        err.response?.data?.error || "Failed to set order to preparing"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4 py-6">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white max-w-md w-full rounded-xl shadow-xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Prepare Order Duration
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Select Duration:
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                  className="w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {durations.map((min) => (
                    <option key={min} value={min}>
                      {min} minutes
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {loading ? "Processing..." : "Confirm & Prepare"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PrepareDurationModal;
