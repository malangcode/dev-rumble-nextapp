"use client";

import { use, useEffect, useState } from "react";
import {
  FaUtensils,
  FaWallet,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import NotificationSkeleton from "@/components/NotificationSkeleton";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useGlobalContext } from "@/context/GlobalContext";

type IconType = "utensils" | "wallet" | "check_circle" | "exclamation_circle";

interface Notification {
  id: number;
  icon: IconType;
  title: string;
  message: string;
  time_ago: string;
  unread: boolean;
}

const notifications = [
  {
    id: 1,
    icon: <FaUtensils className="text-blue-600 text-xl" />,
    title: "New Order Received",
    message: "You have a new order for Chicken Burger.",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    icon: <FaWallet className="text-green-500 text-xl" />,
    title: "Wallet Top-up Successful",
    message: "₹500 has been added to your wallet.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 3,
    icon: <FaCheckCircle className="text-purple-600 text-xl" />,
    title: "Order Delivered",
    message: "Your order #4532 has been delivered.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    icon: <FaExclamationCircle className="text-red-600 text-xl" />,
    title: "Low Stock Alert",
    message: "Pasta is running low in stock.",
    time: "2 days ago",
    unread: true,
  },
];

const iconMap = {
  utensils: <FaUtensils className="text-blue-600 text-xl" />,
  wallet: <FaWallet className="text-green-500 text-xl" />,
  check_circle: <FaCheckCircle className="text-purple-600 text-xl" />,
  exclamation_circle: <FaExclamationCircle className="text-red-600 text-xl" />,
};

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Notification[]>([]);
  const [marking, setMarking] = useState(false);
  const { refreshCounters } = useGlobalContext();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosWithCsrf.get(`/api/notifications/`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const MarkAllAsRead = async () => {
    try {
      setMarking(true);
      await axiosWithCsrf.post(
        "/api/notifications/mark-read",
        {},
        {
          withCredentials: true,
        }
      );
      refreshCounters();
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    } finally {
      setMarking(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setMarking(true);
    const timer = setTimeout(() => {
      MarkAllAsRead();
      fetchNotifications();
    }, 5000); // 2000ms = 2 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  if (loading) {
    return <NotificationSkeleton />;
  }

  return (
    <div className="py-6 bg-[var(--bg-component)] px-2 sm:px-8">
      <h1 className="text-2xl font-semibold mb-6 text-[var(--color-primary)] ">
        Notifications
      </h1>
      <div className="space-y-4 ">
        {data.map((notif) => (
          <div
            key={notif.id}
            className={`flex relative items-start gap-4 p-4 rounded-lg shadow border transition-all ${
              notif.unread
                ? "bg-[var(--blue-50)] border-[var(--blue-100)] "
                : "bg-[var(--bg-card)] border-[var(--gray-200)] "
            }`}
          >
            <div className="mt-1">{iconMap[notif.icon]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-medium text-[var(--text-primary)] ">
                  {notif.title}
                </h2>
                {notif.unread && (
                  <BsDot className="text-[var(--color-primary)] text-3xl" />
                )}
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                {notif.message}
              </p>
              <p className="text-gray-400 text-xs mt-1">{notif.time_ago}</p>
            </div>
            {notif.unread && marking && (
              <span
                className="absolute right-4 top-1/2 w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin z-10 transform -translate-y-1/2"
                style={{ animationDuration: "0.7s" }}
              ></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
