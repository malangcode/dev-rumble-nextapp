"use client";
import { useEffect, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onUpdated?: () => void;
}

const InventoryUpdateModal = ({
  isOpen,
  onClose,
  itemId,
  onUpdated,
}: Props) => {
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    unit: "kg",
    warning_level: "Good",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && itemId !== null) fetchItem();
  }, [isOpen, itemId]);

  const fetchItem = async () => {
    try {
      const res = await axiosWithCsrf.get(`/api/inventory-items/${itemId}/`);
      setFormData({
        item_name: res.data.item_name,
        quantity: res.data.quantity.toString(),
        unit: res.data.unit,
        warning_level: res.data.warning_level,
      });
    } catch {
      setError("Failed to load item.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axiosWithCsrf.put(`/api/inventory-items/${itemId}/`, {
        ...formData,
        quantity: parseFloat(formData.quantity),
      });
      if (onUpdated) onUpdated();
      onClose();
    } catch {
      setError("Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || itemId === null) return null;

  return (
    <div className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-30">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Update Inventory Item
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Item Name
            </label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Quantity"
            />
          </div>
          <input
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Item name"
          />
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Quantity"
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
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="Good">Good</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryUpdateModal;
