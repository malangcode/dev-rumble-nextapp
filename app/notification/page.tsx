"use client";

import { Bell, CheckCircle, AlertCircle } from "lucide-react";

export default function Notification() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Booking Confirmed",
      message: "Your bus ticket has been successfully booked!",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Payment Pending",
      message: "Your payment is still processing, please check again later.",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "info",
      title: "New Offer",
      message: "Get 20% discount on your next booking!",
      time: "1 hr ago",
    },
  ];

  const getIcon = (type:any) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case "warning":
        return <AlertCircle className="text-yellow-500 w-6 h-6" />;
      case "info":
        return <Bell className="text-blue-500 w-6 h-6" />;
      default:
        return <Bell className="text-gray-500 w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Bell className="w-6 h-6 text-fuchsia-500" /> Notifications
        </h1>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/80 dark:bg-zinc-900/70 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition"
            >
              <div className="shrink-0">{getIcon(n.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {n.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {n.message}
                </p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}