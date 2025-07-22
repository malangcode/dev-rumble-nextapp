"use client";
import { useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { X } from "lucide-react";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (item: any) => void; // to refetch inventory after create
}

const InventoryCreateModal = ({ isOpen, onClose, onCreated }: Props) => {
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    unit: "kg",
    warning_level: "Good",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await axiosWithCsrf.post("/api/create-inventory-item/", {
        ...formData,
        quantity: parseFloat(formData.quantity),
      });
      onClose();
      if (onCreated) onCreated(formData.item_name);
    } catch (err: any) {
      console.error(err);
      setError("Failed to create item.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed h-full w-full inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-30">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Add Inventory Item
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Item Name
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Warning Level
            </label>
            <select
              name="warning_level"
              value={formData.warning_level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="Good">Good</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Create Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCreateModal;
