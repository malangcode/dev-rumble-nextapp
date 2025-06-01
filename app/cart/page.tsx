'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import CartSkeleton from '@/components/CartSkeleton';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems([
        {
          id: 1,
          name: 'Margherita Pizza',
          price: 299,
          quantity: 1,
          imageSrc: '/images/pizza.jpg',
        },
        {
          id: 2,
          name: 'Cheeseburger',
          price: 199,
          quantity: 2,
          imageSrc: '/images/burger.jpg',
        },
        {
          id: 3,
          name: 'Penne Alfredo',
          price: 249,
          quantity: 1,
          imageSrc: '/images/pasta.jpg',
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const increaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-blue-700">Your Cart</h1>

      {loading ? (
        <CartSkeleton />
      ) : cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded shadow-sm"
            >
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-500">₹{item.price}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="p-1 rounded border hover:bg-gray-200 transition"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="p-1 rounded border hover:bg-gray-200 transition"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="font-semibold text-lg">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
            <button
              disabled={cartItems.length === 0}
              className="mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
