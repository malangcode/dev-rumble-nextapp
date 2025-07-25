"use client";
import { useState, useEffect } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  onUpdated?: (updated: any) => void;
}

const ReservationUpdateModal = ({
  isOpen,
  onClose,
  reservation,
  onUpdated,
}: Props) => {
  const [form, setForm] = useState({ ...reservation });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...reservation });
  }, [reservation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosWithCsrf.put(
        `/api/reservations/${reservation.id}/`,
        form
      );
      onClose();
      if (onUpdated) onUpdated(res.data);
    } catch (err: any) {
      setError("Failed to update reservation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">Update Reservation</h2>

        <div className="space-y-4 max-h-[500px] overflow-y-auto px-4 py-4 custom-scrollbar">
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
              value={form.customer_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Full Name"
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
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Phone Number"
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
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Email Address"
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
              value={form.date}
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
              value={form.time}
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
              value={form.guests}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="No. of Guests"
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
              value={form.tableNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Table No."
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
              value={form.special_requests}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="e.g. Window seat, birthday cake, etc."
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded mt-4"
        >
          {loading ? "Updating..." : "Update Reservation"}
        </button>
      </div>
    </div>
  );
};

export default ReservationUpdateModal;
