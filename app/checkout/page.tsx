'use client';

import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

import CheckoutSkeleton from '@/components/CheckoutSkeleton';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setCartItems([
        {
          id: 1,
          name: 'Margherita Pizza',
          price: 299,
          quantity: 1,
          image: '/images/pizza.jpg',
        },
        {
          id: 2,
          name: 'Cheeseburger',
          price: 199,
          quantity: 2,
          image: '/images/burger.jpg',
        },
      ]);
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(item.quantity + delta, 1),
            }
          : item
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-gray-500">₹{item.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(item.id, -1)}
                className="bg-gray-200 px-2 rounded"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, 1)}
                className="bg-gray-200 px-2 rounded"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Total:</h2>
          <p className="text-lg text-green-600 font-bold">₹{total}</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-lg">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
