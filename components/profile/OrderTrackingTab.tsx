"use client";

import { useEffect, useState } from "react";
import { TbPackage } from "react-icons/tb";

interface Order {
  id: number;
  status: string;
  ordered_at: string;
  confirmed_at: string | null;
  preparing_at: string | null;
  prepare_duration: number | null;
  progress?: number;
  remainingMin?: number;
  [key: string]: any;
}

interface Props {
  trackingOrders: Order[];
}

const OrderTrackingTab: React.FC<Props> = ({ trackingOrders }) => {
  const [progressData, setProgressData] = useState<Order[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      const updated = trackingOrders.map((order) => {
        let progress = 0;
        let remainingMin = 0;

        const orderedAt = new Date(order.ordered_at).getTime();

        if (order.status === "pending") {
          const duration = 2 * 60 * 1000;
          progress = Math.min(100, ((now - orderedAt) / duration) * 100);
          remainingMin = Math.max(0, 2 - Math.floor((now - orderedAt) / 60000));
        } else if (order.status === "confirmed" && order.confirmed_at) {
          const confirmedAt = new Date(order.confirmed_at).getTime();
          const duration = 2 * 60 * 1000;
          progress = Math.min(100, ((now - confirmedAt) / duration) * 100);
          remainingMin = Math.max(
            0,
            2 - Math.floor((now - confirmedAt) / 60000)
          );
        } else if (
          order.status === "preparing" &&
          order.preparing_at &&
          order.prepare_duration
        ) {
          const preparingAt = new Date(order.preparing_at).getTime();
          const duration = order.prepare_duration * 60 * 1000;
          progress = Math.min(100, ((now - preparingAt) / duration) * 100);
          remainingMin = Math.max(
            0,
            order.prepare_duration - Math.floor((now - preparingAt) / 60000)
          );
        }

        return {
          ...order,
          progress,
          remainingMin,
        };
      });

      setProgressData(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [trackingOrders]);

  const getStatusMessage = (order: Order): string => {
    if (order.status === "pending") {
      return order.remainingMin! > 0
        ? `✅ Estimated time to be confirmed: ${order.remainingMin} min`
        : `✅ Confirming shortly...`;
    } else if (order.status === "confirmed") {
      return order.remainingMin! > 0
        ? `⏳ Estimated time for preparation: ${order.remainingMin} min`
        : `🍳 Preparing will begin shortly...`;
    } else if (order.status === "preparing") {
      return order.remainingMin! > 0
        ? `🍽️ Estimated delivery time: ${order.remainingMin} min`
        : `🚚 Out for delivery!`;
    }
    return "";
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        📦 Track Your Order
      </h2>

      {progressData.length === 0 && (
        <div className="relative bg-gradient-to-r from-gray-50 to-white shadow rounded-lg p-4 shadow animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>

          <div className="h-3 w-40 bg-gray-200 rounded mb-3"></div>

          {/* Moving Icon Placeholder */}
          <div className="relative h-8 mb-1">
            <div className="absolute top-0 left-0">
              <div className="h-6 w-6 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
            <div className="h-full bg-gray-200 w-1/4 rounded-full" />
          </div>

          {/* Bottom Bar Placeholder */}
          <div className="mt-2 h-3 bg-gray-200 rounded-full w-full" />
        </div>
      )}


      <div className="flex flex-col space-y-5">
        {progressData.map((order, index) => (
          <div
            key={order.id || index}
            className="relative bg-gradient-to-r from-gray-50 to-white shadow rounded-lg p-4 shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-lg text-gray-800">
                Order #{order.id}
              </p>
              <span className="text-sm text-gray-500 capitalize">
                Status: {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {getStatusMessage(order)}
            </p>

            {/* Moving Icon */}
            <div className="relative h-8 mb-1">
              <div
                className="absolute top-0 transition-all duration-500"
                style={{
                  left: `calc(${order.progress}% - 16px)`,
                }}
              >
                <TbPackage
                  className={`text-xl ${
                    order.status === "preparing"
                      ? "text-green-600"
                      : "text-blue-500"
                  } animate-pulse`}
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  order.status === "preparing"
                    ? "bg-green-500"
                    : order.progress! < 100
                    ? "bg-blue-500"
                    : "bg-emerald-600"
                }`}
                style={{ width: `${order.progress}%` }}
              />
            </div>

            {/* Skeleton Pulse */}
            {order.progress === 0 && (
              <div className="mt-2 h-3 bg-gray-200 animate-pulse rounded-full w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTrackingTab;
