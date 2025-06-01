'use client';

import { useState } from 'react';

type OrderStatus = 'Processing' | 'Out for Delivery' | 'Delivered';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  orderedAt: string;
}

export default function OrdersPage() {
  const [orders] = useState<OrderItem[]>([
    {
      id: 1,
      name: 'Margherita Pizza',
      image: '/images/pizza.jpg',
      price: 299,
      quantity: 1,
      status: 'Out for Delivery',
      orderedAt: '2025-05-31 10:30 AM',
    },
    {
      id: 2,
      name: 'Cheeseburger',
      image: '/images/burger.jpg',
      price: 199,
      quantity: 2,
      status: 'Delivered',
      orderedAt: '2025-05-30 5:45 PM',
    },
    {
      id: 3,
      name: 'Penne Alfredo',
      image: '/images/pasta.jpg',
      price: 249,
      quantity: 1,
      status: 'Processing',
      orderedAt: '2025-06-01 09:00 AM',
    },
  ]);

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600';
      case 'Out for Delivery':
        return 'text-yellow-500';
      case 'Processing':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center bg-white shadow rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={order.image}
                alt={order.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{order.name}</h2>
                <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                <p className="text-sm text-gray-500">Ordered at: {order.orderedAt}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-md font-semibold">₹{order.price * order.quantity}</p>
              <p className={`text-sm font-medium ${statusColor(order.status)}`}>
                {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
