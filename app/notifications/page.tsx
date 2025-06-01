'use client';

import { useEffect, useState } from 'react';
import { FaUtensils, FaWallet, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { BsDot } from 'react-icons/bs';
import NotificationSkeleton from '@/components/NotificationSkeleton';

const notifications = [
  {
    id: 1,
    icon: <FaUtensils className="text-blue-600 text-xl" />,
    title: 'New Order Received',
    message: 'You have a new order for Chicken Burger.',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: 2,
    icon: <FaWallet className="text-green-500 text-xl" />,
    title: 'Wallet Top-up Successful',
    message: '₹500 has been added to your wallet.',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 3,
    icon: <FaCheckCircle className="text-purple-600 text-xl" />,
    title: 'Order Delivered',
    message: 'Your order #4532 has been delivered.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    icon: <FaExclamationCircle className="text-red-600 text-xl" />,
    title: 'Low Stock Alert',
    message: 'Pasta is running low in stock.',
    time: '2 days ago',
    unread: true,
  },
];

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof notifications>([]);

  useEffect(() => {
    // Simulate fetching data delay
    const timer = setTimeout(() => {
      setData(notifications);
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <NotificationSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-blue-700">Notifications</h1>
      <div className="space-y-4">
        {data.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-4 p-4 rounded-lg shadow border transition-all ${
              notif.unread ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'
            }`}
          >
            <div className="mt-1">{notif.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-medium text-gray-800">{notif.title}</h2>
                {notif.unread && <BsDot className="text-blue-600 text-3xl" />}
              </div>
              <p className="text-gray-600 text-sm">{notif.message}</p>
              <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
