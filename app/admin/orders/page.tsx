'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import { axiosWithCsrf } from '@/lib/axiosWithCsrf';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/context/messageContext';

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showNotification } = useNotification();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/orders/?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (startDate && endDate) url += `start_date=${startDate}&end_date=${endDate}`;

      const response = await axiosWithCsrf.get(url);
      setOrders(response.data.results);
    } catch{
      showNotification('error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  });

  const handleExportCSV = async () => {
    try {
      let url = '/api/admin/orders/?export=csv';
      if (statusFilter) url += `&status=${statusFilter}`;
      if (startDate && endDate) url += `&start_date=${startDate}&end_date=${endDate}`;

      window.open(url, '_blank');
    } catch {
      showNotification('error', 'Failed to export CSV');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <ClipboardList size={22} /> All Orders
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="border px-3 py-2 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          className="border px-3 py-2 rounded-md"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded-md"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button onClick={fetchOrders}>Apply Filter</Button>
        <Button variant="outline" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border shadow-sm rounded-md">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-700">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Table</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Ordered At</th>
                <th className="px-4 py-2 text-left">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t text-sm">
                  <td className="px-4 py-2 font-semibold">#{order.id}</td>
                  <td className="px-4 py-2">{order.user}</td>
                  <td className="px-4 py-2 capitalize text-blue-600">{order.status}</td>
                  <td className="px-4 py-2">{order.table_number || 'N/A'}</td>
                  <td className="px-4 py-2">Rs {parseFloat(order.total_price.toString()).toFixed(2)}</td>
                  <td className="px-4 py-2">{format(new Date(order.ordered_at), 'yyyy-MM-dd HH:mm')}</td>
                  <td className="px-4 py-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-xs text-gray-600">
                        {item.quantity}x {item.product_name} @ Rs {item.price}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
