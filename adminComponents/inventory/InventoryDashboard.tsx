"use client";
import { useEffect, useState } from "react";
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
import { Package, Archive, Clock, Boxes, AlertCircle } from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

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

  useEffect(() => {
    fetchInventory();
  }, [filterLevel]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosWithCsrf.get("/api/inventory-items/", {
        params: {
          warning_level: filterLevel,
        },
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
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

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
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
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">
          Filter by Warning Level:
        </label>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="all">All</option>
          <option value="Good">Good</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

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
                <th className="py-3 px-4 border-r border-gray-200">Warning Level</th>
                <th className="py-3 px-4">Last Updated</th>
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
                  <td className="py-3 px-4 border-r border-gray-200 text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-4 border-r border-gray-200 text-gray-600">{item.unit}</td>
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
                  <td className="py-3 px-4 flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(item.last_updated).toLocaleString()}
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
