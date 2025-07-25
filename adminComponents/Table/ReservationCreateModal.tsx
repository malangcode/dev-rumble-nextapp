"use client";
import { useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (reservation: any) => void;
}

const ReservationCreateModal = ({ isOpen, onClose, onCreated }: Props) => {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: 1,
    tableNumber: 1,
    status: "pending",
    special_requests: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosWithCsrf.post("/api/reservations/create/", form);
      onClose();
      if (onCreated) onCreated(res.data);
    } catch (err: any) {
      setError("Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-4 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">New Reservation</h2>
        <div className="space-y-4 max-h-[500px] px-4 pb-4 custom-scrollbar overflow-y-auto">
          {/* Customer Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="customer_name"
              className="text-sm font-medium text-gray-700"
            >
              Customer Name
            </label>
            <input
              name="customer_name"
              placeholder="Enter full name"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              name="phone"
              placeholder="Phone number"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              name="date"
              type="date"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1">
            <label htmlFor="time" className="text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              name="time"
              type="time"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="guests"
              className="text-sm font-medium text-gray-700"
            >
              Guests
            </label>
            <input
              name="guests"
              type="number"
              placeholder="Number of guests"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Table Number */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tableNumber"
              className="text-sm font-medium text-gray-700"
            >
              Table Number
            </label>
            <input
              name="tableNumber"
              type="number"
              placeholder="Table number"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          {/* Special Requests */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="special_requests"
              className="text-sm font-medium text-gray-700"
            >
              Special Requests
            </label>
            <input
              name="special_requests"
              placeholder="Any special requests?"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        >
          {loading ? "Saving..." : "Create Reservation"}
        </button>
      </div>
    </div>
  );
};

export default ReservationCreateModal;
