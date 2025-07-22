"use client";
import { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Package, Clock, Boxes, Edit, Trash2, RefreshCcw } from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import InventoryCreateModal from "./CreateInventoryModal";
import { toast } from "react-toastify";
import InventoryUpdateModal from "./InventoryUpdateModal";
import InventoryDeleteModal from "./InventoryDeleteModal";
import { useDebounce } from "use-debounce";
import InventorySkeleton from "./InventorySkeleton";

// Define your type
interface InventoryItem {
  id: number;
  item_name: string;
  quantity: number;
  unit: string;
  warning_level: "Good" | "Medium" | "Low" | "Critical";
  last_updated: string;
}

const warningColors: Record<string, string> = {
  Good: "#22c55e",
  Medium: "#eab308",
  Low: "#f97316",
  Critical: "#ef4444",
};

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const firstRun = useRef(true);

  useEffect(() => {
    const debouncedFetch = setTimeout(() => {
      fetchInventory(firstRun.current);
      firstRun.current = false;
    }, 500);

    return () => clearTimeout(debouncedFetch);
  }, [filterLevel, debouncedSearchTerm]);

  const fetchInventory = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await axiosWithCsrf.get("/api/inventory-items/", {
        params: {
          warning_level: filterLevel,
          search: searchTerm,
        },
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const res = await axiosWithCsrf.get("/api/inventory-items/", {
        params: { export: "csv" },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV export failed", err);
    }
  };

  const pieData = inventory.map((item) => ({
    name: item.item_name,
    value: item.quantity,
  }));

  if (loading) {
    return <InventorySkeleton />;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-3 gap-4">
        <button
          onClick={() => fetchInventory(true)}
          className="flex items-center gap-1 text-sm px-3 py-2 bg-[var(--gray-200)] hover:bg-[--gray-300] rounded text-[var(--text-secondary)]"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Dashboard
          </h1>
          <p className="text-gray-500">
            Track stock levels and status of your inventory items
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Item
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      <InventoryCreateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(name) => {
          fetchInventory();
          toast.success(`Item ${name} added successfully!`);
        }}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Stock Levels
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inventory}>
              <XAxis dataKey="item_name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Warning Levels
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name} // ✅ show item name
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={Object.values(warningColors)[index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <InventoryUpdateModal
        isOpen={editOpen}
        itemId={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={fetchInventory}
      />

      <InventoryDeleteModal
        isOpen={deleteOpen}
        itemId={deleteId}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          fetchInventory();
          toast.success(`Item deleted successfully!`);
        }}
      />

      {/* search and filter bar  */}
      <div className="flex items-center gap-4 mb-4 bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--gray-200)] ">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory items by name..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--gray-300)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)] transition"
          />
          <div className="absolute left-3 top-2.5 text-[var(--text-secondary)] ">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.5-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 shadow py-2 border border-[var(--gray-300)] rounded-lg"
          >
            <option value="all">All</option>
            <option value="Good">Good</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Boxes className="w-5 h-5 text-blue-600" />
          Inventory Items
        </h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading inventory...</p>
        ) : (
          <table className="min-w-full text-sm text-left border border-gray-200 divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                <th className="py-3 px-4 border-r border-gray-200">Item</th>
                <th className="py-3 px-4 border-r border-gray-200">Quantity</th>
                <th className="py-3 px-4 border-r border-gray-200">Unit</th>
                <th className="py-3 px-4 border-r border-gray-200">
                  Warning Level
                </th>
                <th className="py-3 px-4 border-r border-gray-200">
                  Last Updated
                </th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="py-3 px-4 border-r border-gray-200 font-medium text-gray-800 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    {item.item_name}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200 text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200 text-gray-600">
                    {item.unit}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200">
                    <span
                      className="px-2 py-1 text-xs rounded-full text-white"
                      style={{
                        backgroundColor: warningColors[item.warning_level],
                      }}
                    >
                      {item.warning_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2 border-r border-gray-200 text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(item.last_updated).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center justify-around">
                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setEditOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setDeleteOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
