"use client";

import {
  CreditCard,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Ban,
  Smartphone,
  Wallet,
  DollarSign,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useDebounce } from "use-debounce";
import AdminPaymentsSkeleton from "./AdminPaymentsSkeleton";
import SingleOrderView from "../orders/SingleOrderView";

type Payment = {
  id: number;
  user: string;
  order_id: number;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id?: string;
  created_at: string;
};

// Dummy data
const dummyPayments: Payment[] = [
  {
    id: 1,
    user: "John Doe",
    order_id: 1001,
    amount: 250.0,
    payment_method: "card",
    status: "completed",
    transaction_id: "TXN123456",
    created_at: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    user: "Jane Smith",
    order_id: 1002,
    amount: 180.5,
    payment_method: "cash",
    status: "pending",
    transaction_id: "TXN123457",
    created_at: "2025-01-15T11:15:00Z",
  },
  {
    id: 3,
    user: "Bob Wilson",
    order_id: 1003,
    amount: 320.75,
    payment_method: "digital",
    status: "completed",
    transaction_id: "TXN123458",
    created_at: "2025-01-15T12:00:00Z",
  },
  {
    id: 4,
    user: "Alice Brown",
    order_id: 1004,
    amount: 95.25,
    payment_method: "card",
    status: "failed",
    transaction_id: "TXN123459",
    created_at: "2025-01-15T13:45:00Z",
  },
  {
    id: 5,
    user: "Mike Johnson",
    order_id: 1005,
    amount: 450.0,
    payment_method: "cash",
    status: "refunded",
    transaction_id: "TXN123460",
    created_at: "2025-01-15T14:20:00Z",
  },
  {
    id: 6,
    user: "Sarah Davis",
    order_id: 1006,
    amount: 275.8,
    payment_method: "digital",
    status: "completed",
    transaction_id: "TXN123461",
    created_at: "2025-01-15T15:10:00Z",
  },
];

const AdminPaymentsComponent = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const fetchPayments = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axiosWithCsrf.get("/api/payments/", {
        params: {
          page,
          limit,
          status: statusFilter,
          method: methodFilter,
          search: debouncedSearch,
        },
      });
      setPayments(res.data.results);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const firstRun = useRef(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPayments(firstRun.current);
      firstRun.current = false;
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [page, statusFilter, methodFilter, debouncedSearch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "refunded":
        return <RotateCcw className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <Ban className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "card":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "digital":
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
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

  const handleExportCSV = () => {
    const params = new URLSearchParams({
      status: statusFilter,
      method: methodFilter,
      searchTerm,
      export: "csv",
    });
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments/?${params.toString()}`,
      "_blank"
    );
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" || payment.payment_method === methodFilter;
    const matchesSearch =
      searchTerm === "" ||
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order_id.toString().includes(searchTerm) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesMethod && matchesSearch;
  });

  // Calculate stats
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const completedPayments = payments.filter(
    (p) => p.status === "completed"
  ).length;
  const failedPayments = payments.filter((p) => p.status === "failed").length;

  if (loading) {
    return <AdminPaymentsSkeleton />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-3 gap-4">
        <button
          onClick={() => fetchPayments(true)}
          className="flex items-center gap-1 text-sm px-3 py-2 bg-[var(--gray-200)] hover:bg-[--gray-300] rounded text-[var(--text-secondary)]"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Management
            </h1>
            <p className="text-gray-600">
              Track and manage all payment transactions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {Number(totalRevenue).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingPayments}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedPayments}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {failedPayments}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              <Filter />
            </span>
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="fake">Fake Payment</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="digital">Digital</option>
          </select>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            All Payments ({filteredPayments.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {payment.user.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {payment.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{payment.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs {Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(payment.payment_method)}
                      <span className="text-sm text-gray-900 capitalize">
                        {payment.payment_method}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.transaction_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrderId(payment.order_id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No payments found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {selectedOrderId && (
        <SingleOrderView
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          First
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default AdminPaymentsComponent;
function fetchPayments() {
  throw new Error("Function not implemented.");
}
