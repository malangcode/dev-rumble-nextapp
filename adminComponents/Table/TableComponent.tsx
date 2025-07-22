import { useState, useEffect, useRef } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Edit3,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Utensils,
  Eye,
  RefreshCcw,
} from "lucide-react";
import TableManagementSkeleton from "./TableSkeleton";
// import { useDebounce } from "use-debounce";

interface Table {
  id: string;
  number: number;
  seats: number;
  availableSeats: number;
  area: string;
  areas: [];
  status: "occupied" | "reserved" | "available" | "cleaning";
  customers: string[] | null;
  timeOccupied?: string | null;
  estimatedFinish?: string | null;
  orderValue: number;
  reservationTime?: string;
  phone?: string;
}

interface Reservation {
  id: number; // API uses number, not string
  customer_name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: number;
  status: "confirmed" | "pending";
  special_requests?: string;
  created_at: string;
}

type Updates = {
  time: string;
  message: string;
  type: "success" | "info" | "warning";
};

const TableManagement: React.FC = () => {
  const [selectedView, setSelectedView] = useState("floor");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Updates[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  // const [debouncedSearch] = useDebounce(searchTerm, 500);

  // const tables: Table[] = [/* ...same table data... */];
  // const reservations: Reservation[] = [/* ...same reservation data... */];

  
  const fetchTables = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axiosWithCsrf.get("/api/tables/");
      setTables(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tables");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchUpdates = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axiosWithCsrf.get("/api/table-update-logs/");
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load updates");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchReservations = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axiosWithCsrf.get("/api/reservations/", {
        params: {
          date: selectedDate,
          time: selectedTimeSlot,
          // search: searchTerm,
          // area: area,
        },
      });
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reservations");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetchTables(firstRun.current);
      fetchReservations(firstRun.current);
      fetchUpdates(firstRun.current);
      firstRun.current = false;
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [selectedDate, selectedTimeSlot]);

  useEffect(() => {
    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchUpdates(false);
    }, 15000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);


  const timeSlots = [
    "-----",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ];

  const areas = ["Main Hall", "Window Side", "Counter Side", "Private Section"];

  // const allAreas = tables.length > 0 ? tables[0].areas : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "cleaning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "occupied":
        return <Users className="h-4 w-4" />;
      case "reserved":
        return <Calendar className="h-4 w-4" />;
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "cleaning":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    if (table.status === "available") {
      setShowReservationModal(true);
    }
  };

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    try {
      await axiosWithCsrf.patch(`/api/tables/${tableId}/`, {
        status: newStatus,
      });
      await fetchTables(); // Refresh table list
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.customers?.some((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      table.number.toString().includes(searchTerm) ||
      (table.area || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea =
      !selectedArea ||
      (table.area || "").toLowerCase() === selectedArea.toLowerCase();

    return matchesSearch && matchesArea;
  });

  const filteredReservations = reservations.filter(
    (res) =>
      (res.customer_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (res.phone || "").includes(searchTerm) ||
      res.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <TableManagementSkeleton />;
  }

  return (
    <div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center mb-3 gap-4">
          <button
            // onClick={() => fetchMenuItems(true)}
            className="flex items-center gap-1 text-sm px-3 py-2 bg-[var(--gray-200)] hover:bg-[--gray-300] rounded text-[var(--text-secondary)]"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Table Management
              </h1>
              <p className="text-gray-600">
                Manage table reservations, availability and dining area layout
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReservationModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <MapPin className="h-4 w-4 mr-2" />
                Floor Plan
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              {
                label: "Total Tables",
                value: tables.length,
                color: "bg-blue-500",
              },
              {
                label: "Available",
                value: tables.filter((t) => t.status === "available").length,
                color: "bg-green-500",
              },
              {
                label: "Occupied",
                value: tables.filter((t) => t.status === "occupied").length,
                color: "bg-red-500",
              },
              {
                label: "Reserved",
                value: tables.filter((t) => t.status === "reserved").length,
                color: "bg-yellow-500",
              },
              {
                label: "Cleaning",
                value: tables.filter((t) => t.status === "cleaning").length,
                color: "bg-blue-400",
              },
              {
                label: "Total Capacity",
                value: tables.reduce((sum, t) => sum + t.seats, 0),
                color: "bg-purple-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div
                  className={`w-3 h-3 rounded-full ${stat.color} mb-2`}
                ></div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Mode
                </label>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="floor">Floor Plan</option>
                  <option value="list">Table List</option>
                  <option value="reservations">Reservations</option>
                </select>
              </div>
              {selectedView == "reservations" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Time Slot
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {selectedView !== "reservations" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Area Filter
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Areas</option>
                    {areas.map((area: string, index: number) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="h-4 w-4 inline mr-1" />
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tables, customers..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Content based on selected view */}
          {selectedView === "floor" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Floor Plan Layout
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredTables.map((table) => (
                  <div
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(
                      table.status
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">T{table.number}</span>
                      {getStatusIcon(table.status)}
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {table.seats} seats
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {table.area}
                      </p>

                      {table.availableSeats && (
                        <p className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {table.availableSeats} available
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === "list" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Table List
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Table
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Seats
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Area
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Available
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Order Value
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((table) => (
                      <tr
                        key={table.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold">
                            Table {table.number}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {table.seats}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600">{table.area}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                              table.status
                            )}`}
                          >
                            {table.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select className="mr-1 px-2 py-1 border w-full border-gray-300 rounded text-sm">
                            {table.customers && table.customers.length > 0 ? (
                              table.customers.map((name, index) => (
                                <option key={index} value={name}>
                                  {name}
                                </option>
                              ))
                            ) : (
                              <option disabled value="">
                                -
                              </option>
                            )}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm flex items-center font-semibold text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            {table.availableSeats}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">
                            {table.orderValue > 0
                              ? `Rs. ${table.orderValue}`
                              : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <select
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              value={table.status}
                              onChange={(e) =>
                                handleStatusChange(table.id, e.target.value)
                              }
                            >
                              <option value="available">Available</option>
                              <option value="occupied">Occupied</option>
                              <option value="reserved">Reserved</option>
                              <option value="cleaning">Cleaning</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedView === "reservations" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Reservations
              </h3>
              <div className="grid gap-4">
                {filteredReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {reservation.customer_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {reservation.id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {reservation.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {reservation.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {reservation.guests} guests
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Utensils className="h-4 w-4 mr-2" />
                        Table {reservation.tableNumber}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {reservation.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {reservation.email}
                      </div>
                    </div>

                    {reservation.special_requests && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <strong>Special Requests:</strong>{" "}
                          {reservation.special_requests}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Created: {reservation.created_at}
                      </p>
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Updates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Real-time Updates
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>

            {/* [
                {
                  time: "12:45",
                  message: "Table 3 became available",
                  type: "success",
                },
                {
                  time: "12:42",
                  message: "New reservation for Table 7 at 19:30",
                  type: "info",
                },
                {
                  time: "12:40",
                  message: "Table 5 cleaning completed",
                  type: "success",
                },
                {
                  time: "12:38",
                  message: "Table 1 order completed - Rs. 850",
                  type: "info",
                },
                {
                  time: "12:35",
                  message: "Table 8 estimated finish time updated",
                  type: "warning",
                },
              ] */}

            <div className="space-y-3">
              {updates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50"
                >
                  <span className="text-xs text-gray-500">{update.time}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      update.type === "success"
                        ? "bg-green-500"
                        : update.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {update.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
