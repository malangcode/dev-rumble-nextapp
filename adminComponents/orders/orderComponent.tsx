"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Eye,
  Users,
  DollarSign,
} from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useNotification } from "@/context/messageContext";
import SingleOrderView from "./SingleOrderView";
import { RefreshCcw } from "lucide-react";
import { useDebounce } from "use-debounce";

type OrderItem = {
  id: number;
  quantity: number;
  product_name: string;
  price: number;
};

type Order = {
  id: number;
  user: string;
  status: string;
  table_number?: string | null;
  total_price: string | number;
  ordered_at: string;
  items: OrderItem[];
};

const AdminOrdersComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const fetchOrders = async (showloading = true) => {
    try {
      if (showloading) setLoading(true);
      let url = `/api/admin/orders/?page=${currentPage}&`;
      // Only include status if it's not "all"
      if (statusFilter && statusFilter !== "all") {
        url += `status=${statusFilter}&`;
      }
      if (searchTerm.trim() !== "") {
        url += `search=${searchTerm}&`;
      }
      if (startDate && endDate)
        url += `start_date=${startDate}&end_date=${endDate}`;

      const response = await axiosWithCsrf.get(url);
      setOrders(response.data.results); // if response has `.results`
      setTotalPages(Math.ceil(response.data.count / 100));
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        ((err as any).response.status === 404 ||
          (err as any).response.data?.detail === "Invalid page.")
      ) {
        setCurrentPage(1);
        return;
      }
      console.error("Error fetching orders:", err);
      showNotification("error", "Oops! Something went Worng.");
    } finally {
      if (showloading) setLoading(false);
    }
  };

  const firstRun = useRef(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders(firstRun.current);
      firstRun.current = false;
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [debouncedSearch, statusFilter, startDate, endDate, currentPage]);

  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "preparing":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportCSV = async () => {
    try {
      let url = "/api/admin/orders/?export=csv";
      if (statusFilter) url += `&status=${statusFilter}`;
      if (startDate && endDate) {
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }

      const response = await axiosWithCsrf.get(url, {
        responseType: "blob", // <- important
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "orders.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to export CSV");
    }
  };

  const recentOrders = orders.slice(0, 5);
  const totalRevenue = orders.reduce(
    (sum, order) => sum + parseFloat(order.total_price.toString()),
    0
  );
  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const SkeletonCard = () => (
    <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--gray-200)] p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-20 bg-[var(--gray-200)] rounded" />
        <div className="h-5 w-16 bg-[var(--gray-200)] rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--gray-200)] rounded-full" />
          <div className="h-4 w-24 bg-[var(--gray-200)] rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--gray-200)] rounded-full" />
          <div className="h-4 w-20 bg-[var(--gray-200)] rounded" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 w-24 bg-[var(--gray-200)] rounded" />
          <div className="w-6 h-6 bg-[var(--gray-200)] rounded" />
        </div>
      </div>
    </div>
  );

  const SkeletonTableRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bgbg-[var(--gray-200)] rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  if (loading) {
    return (
      <div className="p-6 bg-[var(--bg-component)] min-h-screen space-y-6">
        {/* Refresh Button Skeleton */}
        <div className="flex items-center mb-3 justify-right">
          <div className="w-24 h-8 bg-[var(--gray-200)] rounded animate-pulse"></div>
        </div>

        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--gray-200)] rounded-lg animate-pulse w-10 h-10" />
            <div>
              <div className="h-6 bg-[var(--gray-200)] rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-[var(--gray-200)] rounded w-64 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="h-4 bg-[var(--gray-200)] rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-6 bg-[var(--gray-300)] rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 bg-[var(--bg-card)] border border-[var(--gray-200)] rounded-xl p-4 animate-pulse"
            ></div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <div className="h-6 w-40 bg-[var(--gray-200)] rounded animate-pulse" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6 mb-6 animate-pulse h-20"></div>
        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6 mb-6 animate-pulse h-20">
          <div className="h-8 w-80 bg-[var(--bg-icon)] shadow-sm rounded-lg animate-pulse"></div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--gray-200)] bg-[var(--bg-component)] ">
            <div className="h-5 w-40 bg-[var(--gray-200)] rounded animate-pulse" />
          </div>
          <table className="w-full">
            <thead className="bg[var(--bg-component)] border-b border-[var(--gray-200)] ">
              <tr>
                {Array.from({ length: 8 }).map((_, idx) => (
                  <th key={idx} className="px-6 py-4">
                    <div className="h-3 w-20 bg-[var(--gray-200)] rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonTableRow key={idx} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-2 lg:p-4 xl:p-6 bg-[var(--bg-component)] min-h-screen">
      <div className="flex items-center mb-3 justify-right">
        <button
          onClick={() => fetchOrders(true)}
          className="flex items-center gap-1 text-sm px-3 py-1 bg-[var(--gray-200)] hover:bg-[var(--gray-300)] rounded text-[var(--text-primary)] "
          title="Refresh Order"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--blue-100)] rounded-lg">
            <ClipboardList className="w-6 h-6 text-[var(--color-primary)] " />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] ">
              Order Management
            </h1>
            <p className="text-[var(--text-secondary)] ">
              Manage and track all restaurant orders
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-[var(--text-secondary)] ">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)] ">
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)] ">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)] ">
                Rs {totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)] ">
                Pending Orders
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)] ">
                Active Customers
              </p>
              <p className="text-2xl font-bold text-[var(--color-primary)] ">
                {orders.length}
              </p>
            </div>
            <div className="p-3 bg-[var(--blue-100)] rounded-lg">
              <Users className="w-6 h-6 text-[var(--color-primary)] " />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)] ">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Recent Orders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--text-secondary)] ">
                  #{order.id}
                </span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    order.status
                  )}`}
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--text-secondary)] " />
                  <span className="text-sm text-[var(--text-secondary)] ">
                    {order.user}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--text-secondary)] " />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {order.table_number || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    Rs {parseFloat(order.total_price.toString()).toFixed(2)}
                  </span>
                  <button
                    className="p-1 hover:bg-[var(--bg-icon)] rounded"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <Eye className="w-4 h-4 text-[var(--text-secondary)] " />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrderId && (
        <SingleOrderView
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* Filters and Export */}
      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[var(--text-secondary)] " />
            <span className="text-sm font-medium text-[var(--text-primary)] ">
              Filters:
            </span>
          </div>

          <select
            className="px-4 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--bg-card)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="date"
            className="px-4 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--bg-card)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />

          <input
            type="date"
            className="px-4 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--bg-card)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          {/* <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or order ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
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
          </div> */}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between shadow-sm bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--gray-200)]">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or order ID"
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
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--gray-200)] bg-[var(--bg-component)] ">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] ">
            All Orders ({orders.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-component)] border-b border-[var(--gray-200)] ">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Table
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Ordered At
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-component)] divide-y divide-[var(--gray-200)] ">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[var(--bg-component)] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[var(--text-primary)] ">
                      #{order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[var(--blue-100)] rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-[var(--color-primary)] ">
                          {order.user.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-[var(--text-primary)] ">
                        {order.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)] ">
                    {order.table_number || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)] ">
                    Rs {parseFloat(order.total_price.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)] ">
                    {formatDate(order.ordered_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="text-xs text-[var(--text-secondary)] "
                        >
                          {item.quantity}x {item.product_name} @ Rs {item.price}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-[var(--text-secondary)] ">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-[var(--color-primary)] hover:text-blue-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-[var(--color-secondary)] mx-auto mb-4" />
            <p className="text-gray-500">
              No orders found matching your criteria.
            </p>
          </div>
        )}

        <div className="flex justify-center p-6 border-t border-[var(--gray-200)] mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 bg-[var(--gray-200)] text-sm rounded-lg disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-[var(--color-primary)] text-sm text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 bg-[var(--color-primary)] text-sm text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersComponent;
