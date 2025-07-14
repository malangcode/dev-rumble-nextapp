import React from "react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  ClipboardList,
  Banknote,
  Table2,
  Users,
  UserCheck,
  TrendingUp,
  ShoppingCart,
  Clock,
  Star,
  AlertTriangle,
} from "lucide-react";
import { RefreshCcw } from "lucide-react";
import DashboardSkeleton from "./DashboardSkeleton";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  type DashboardData = {
    salesData: Array<any>;
    menuItemsData: Array<any>;
    hourlyOrdersData: Array<any>;
    monthlyRevenueData: Array<any>;

    recentOrdersData: Array<{
      id: number | string;
      item: string;
      time: string;
      status: string;
      amount: string;
    }>;

    staffPerformanceData: Array<{
      name: string;
      role: string;
      orders: number;
      rating: number;
    }>;

    inventoryAlertsData: Array<{
      item: string;
      stock: string;
      level: string;
      color: "red" | "yellow" | "green";
    }>;

    topStatsCards: {
      total_orders: number | string;
      total_sales: number | string;
      active_tables: number | string;
      total_staff: number | string;
      active_users: number | string;
      avg_order_value: number | string;
    };
    quickMetrics: {
      orders_in_queue: number | string;
      avg_rating: number | string;
      stock_alerts: number | string;
      peak_hour: string;
    };
  };

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const fetchDashboard = async (showloading = true) => {
    try {
      if(showloading) setLoading(true);
      const response = await axiosWithCsrf.get("/api/dashboard/");
      setDashboard(response.data);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      if(showloading) setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedelay = setTimeout(() => {
       fetchDashboard(true);
    }, 500);
  }, []);

  // // Dummy data for charts
  // const salesData = [
  //   { name: "Mon", sales: 4200, orders: 45 },
  //   { name: "Tue", sales: 5800, orders: 62 },
  //   { name: "Wed", sales: 3900, orders: 38 },
  //   { name: "Thu", sales: 6200, orders: 71 },
  //   { name: "Fri", sales: 8100, orders: 89 },
  //   { name: "Sat", sales: 9500, orders: 105 },
  //   { name: "Sun", sales: 7300, orders: 82 },
  // ];

  // const menuItemsData = [
  //   { name: "Dal Bhat", value: 35, color: "#8B5CF6" },
  //   { name: "Momo", value: 25, color: "#06B6D4" },
  //   { name: "Noodles", value: 20, color: "#10B981" },
  //   { name: "Tea/Coffee", value: 15, color: "#F59E0B" },
  //   { name: "Others", value: 5, color: "#EF4444" },
  // ];

  // const hourlyOrdersData = [
  //   { hour: "6AM", orders: 12 },
  //   { hour: "7AM", orders: 28 },
  //   { hour: "8AM", orders: 45 },
  //   { hour: "9AM", orders: 35 },
  //   { hour: "10AM", orders: 22 },
  //   { hour: "11AM", orders: 18 },
  //   { hour: "12PM", orders: 65 },
  //   { hour: "1PM", orders: 78 },
  //   { hour: "2PM", orders: 52 },
  //   { hour: "3PM", orders: 25 },
  //   { hour: "4PM", orders: 18 },
  //   { hour: "5PM", orders: 35 },
  //   { hour: "6PM", orders: 42 },
  //   { hour: "7PM", orders: 28 },
  // ];

  // const monthlyRevenueData = [
  //   { month: "Jan", revenue: 145000, target: 150000 },
  //   { month: "Feb", revenue: 158000, target: 160000 },
  //   { month: "Mar", revenue: 172000, target: 170000 },
  //   { month: "Apr", revenue: 164000, target: 175000 },
  //   { month: "May", revenue: 189000, target: 180000 },
  //   { month: "Jun", revenue: 198000, target: 190000 },
  // ];

  // const topStatsCards = [
  //   {
  //     title: "Total Orders",
  //     value: "1,542",
  //     change: "+12.5%",
  //     icon: <ClipboardList className="h-6 w-6 text-blue-600" />,
  //     bgColor: "bg-blue-50",
  //     changeColor: "text-green-600",
  //   },
  //   {
  //     title: "Total Sales",
  //     value: "Rs. 2,48,000",
  //     change: "+8.2%",
  //     icon: <Banknote className="h-6 w-6 text-green-600" />,
  //     bgColor: "bg-green-50",
  //     changeColor: "text-green-600",
  //   },
  //   {
  //     title: "Active Tables",
  //     value: "18/25",
  //     change: "72%",
  //     icon: <Table2 className="h-6 w-6 text-purple-600" />,
  //     bgColor: "bg-purple-50",
  //     changeColor: "text-blue-600",
  //   },
  //   {
  //     title: "Total Staff",
  //     value: "24",
  //     change: "+2",
  //     icon: <Users className="h-6 w-6 text-orange-600" />,
  //     bgColor: "bg-orange-50",
  //     changeColor: "text-green-600",
  //   },
  //   {
  //     title: "Active Users",
  //     value: "156",
  //     change: "+18.7%",
  //     icon: <UserCheck className="h-6 w-6 text-indigo-600" />,
  //     bgColor: "bg-indigo-50",
  //     changeColor: "text-green-600",
  //   },
  //   {
  //     title: "Avg Order Value",
  //     value: "Rs. 185",
  //     change: "+5.3%",
  //     icon: <TrendingUp className="h-6 w-6 text-pink-600" />,
  //     bgColor: "bg-pink-50",
  //     changeColor: "text-green-600",
  //   },
  // ];

  // const quickMetrics = [
  //   {
  //     label: "Orders in Queue",
  //     value: "8",
  //     icon: <Clock className="h-4 w-4" />,
  //     color: "text-yellow-600",
  //   },
  //   {
  //     label: "Avg Rating",
  //     value: "4.6",
  //     icon: <Star className="h-4 w-4" />,
  //     color: "text-yellow-500",
  //   },
  //   {
  //     label: "Stock Alerts",
  //     value: "3",
  //     icon: <AlertTriangle className="h-4 w-4" />,
  //     color: "text-red-600",
  //   },
  //   {
  //     label: "Peak Hour",
  //     value: "1PM",
  //     icon: <TrendingUp className="h-4 w-4" />,
  //     color: "text-blue-600",
  //   },
  // ];

  // Instead, use:
  const salesData = dashboard?.salesData || [];
  const menuItemsData = dashboard?.menuItemsData || [];
  const hourlyOrdersData = dashboard?.hourlyOrdersData || [];
  const monthlyRevenueData = dashboard?.monthlyRevenueData || [];

  const topStatsCards = [
    {
      title: "Total Orders",
      value: dashboard?.topStatsCards?.total_orders,
      change: "+12.5%",
      icon: <ClipboardList className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      changeColor: "text-green-600",
    },
    {
      title: "Total Sales",
      value: `Rs. ${dashboard?.topStatsCards?.total_sales}`,
      change: "+8.2%",
      icon: <Banknote className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-50",
      changeColor: "text-green-600",
    },
    {
      title: "Active Tables",
      value: dashboard?.topStatsCards?.active_tables,
      change: "72%",
      icon: <Table2 className="h-6 w-6 text-purple-600" />,
      bgColor: "bg-purple-50",
      changeColor: "text-blue-600",
    },
    {
      title: "Total Staff",
      value: dashboard?.topStatsCards?.total_staff,
      change: "+2",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      bgColor: "bg-orange-50",
      changeColor: "text-green-600",
    },
    {
      title: "Active Users",
      value: dashboard?.topStatsCards?.active_users,
      change: "+18.7%",
      icon: <UserCheck className="h-6 w-6 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      changeColor: "text-green-600",
    },
    {
      title: "Avg Order Value",
      value: `Rs. ${dashboard?.topStatsCards?.avg_order_value}`,
      change: "+5.3%",
      icon: <TrendingUp className="h-6 w-6 text-pink-600" />,
      bgColor: "bg-pink-50",
      changeColor: "text-green-600",
    },
  ];

  const quickMetrics = [
    {
      label: "Orders in Queue",
      value: dashboard?.quickMetrics?.orders_in_queue,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
    },
    {
      label: "Avg Rating",
      value: dashboard?.quickMetrics?.avg_rating,
      icon: <Star className="h-4 w-4" />,
      color: "text-yellow-500",
    },
    {
      label: "Stock Alerts",
      value: dashboard?.quickMetrics?.stock_alerts,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600",
    },
    {
      label: "Peak Hour",
      value: dashboard?.quickMetrics?.peak_hour,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-blue-600",
    },
  ];

  if (loading || !dashboard) return <DashboardSkeleton />;

  // destructure real-time data
  // const {
  //   salesData,
  //   menuItemsData,
  //   hourlyOrdersData,
  //   monthlyRevenueData,
  //   topStatsCards,
  //   quickMetrics,
  // } = dashboard;

  return (
    <div className="p-3 md:p-2 lg:p-4 xl:p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <div className="flex items-center mb-3 justify-right">
        <button
          onClick={() => fetchDashboard(true)}
          className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
          title="Refresh Order"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Canteen Management Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time insights and analytics for your canteen operations
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {topStatsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-102"
            >
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center mb-4`}
              >
                {card.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </p>
              <p className={`text-sm ${card.changeColor} font-medium`}>
                {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Metrics Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Sales & Orders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Weekly Sales & Orders
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Menu Items */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Popular Menu Items
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={menuItemsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {menuItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Orders & Monthly Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Orders Pattern */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Hourly Orders Pattern
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Revenue vs Target */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Monthly Revenue vs Target
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Orders
            </h3>
            <div className="space-y-4">
              {/* {[
                {
                  id: "#1234",
                  item: "Dal Bhat Set",
                  time: "2 min ago",
                  status: "Preparing",
                  amount: "Rs. 150",
                },
                {
                  id: "#1235",
                  item: "Chicken Momo",
                  time: "5 min ago",
                  status: "Ready",
                  amount: "Rs. 200",
                },
                {
                  id: "#1236",
                  item: "Veg Noodles",
                  time: "8 min ago",
                  status: "Served",
                  amount: "Rs. 180",
                },
                {
                  id: "#1237",
                  item: "Tea + Samosa",
                  time: "12 min ago",
                  status: "Served",
                  amount: "Rs. 80",
                },
              ].map((order, index) => ( */}
              {dashboard?.recentOrdersData?.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.item}</p>
                    <p className="text-sm text-gray-600">
                      {order.id} • {order.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {order.amount}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Preparing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Ready"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Staff Performance
            </h3>
            <div className="space-y-4">
              {/* {[
                { name: "Ravi Kumar", role: "Chef", orders: 45, rating: 4.8 },
                {
                  name: "Sita Sharma",
                  role: "Server",
                  orders: 38,
                  rating: 4.6,
                },
                {
                  name: "Prakash Rai",
                  role: "Cashier",
                  orders: 52,
                  rating: 4.9,
                },
                {
                  name: "Maya Gurung",
                  role: "Server",
                  orders: 41,
                  rating: 4.7,
                },
              ].map((staff, index) => ( */}
              {dashboard?.staffPerformanceData?.map((staff, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <p className="text-sm text-gray-600">{staff.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {staff.orders} orders
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">
                        {staff.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Inventory Alerts
            </h3>
            <div className="space-y-4">
              {/* {[
                {
                  item: "Basmati Rice",
                  stock: "5 kg",
                  level: "Low",
                  color: "red",
                },
                {
                  item: "Chicken",
                  stock: "2 kg",
                  level: "Critical",
                  color: "red",
                },
                {
                  item: "Onions",
                  stock: "8 kg",
                  level: "Medium",
                  color: "yellow",
                },
                {
                  item: "Dal (Lentils)",
                  stock: "12 kg",
                  level: "Good",
                  color: "green",
                },
                {
                  item: "Cooking Oil",
                  stock: "3 L",
                  level: "Low",
                  color: "red",
                },
              ].map((item, index) => ( */}
              {dashboard?.inventoryAlertsData?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.item}</p>
                    <p className="text-sm text-gray-600">Stock: {item.stock}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.color === "red"
                        ? "bg-red-100 text-red-800"
                        : item.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.level}
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

export default Dashboard;
