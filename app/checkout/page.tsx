"use client";

import { useState, useEffect } from "react";
import CheckoutSkeleton from "@/components/CheckoutSkeleton";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import PopupMessage from "@/components/PopupMessage";
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosWithCsrf.get("/api/cart/items/");
        const mappedItems = res.data.map((item: any) => ({
          id: item.id,
          name: item.product_name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          imageSrc: item.product_image,
        }));
        setCartItems(mappedItems);
      } catch (err: any) {
        setError(err.message || "Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await axiosWithCsrf.post("/api/cart/update/", {
        cart_item_id: id,
        quantity: newQty,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updateQuantity(id, newQty);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);

    try {
      const res = await axiosWithCsrf.post("/api/checkout/");
      setCheckoutSuccess(
        `Order placed successfully! Order ID: ${res.data.order.id}`
      );
      // Optionally clear the cart here or refetch cart items:
      setCartItems([]);
    } catch (err: any) {
      setCheckoutError(err.response?.data?.error || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <CheckoutSkeleton />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-blue-700 text-left mb-1">
        Checkout
      </h1>

      <BackButton />

      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md p-4 text-sm sm:text-base mb-6">
        <strong>Note:</strong> You are about to place your order. Please
        double-check your items. Once placed, the order cannot be changed.
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-4 gap-y-4 sm:gap-x-6 border border-gray-100"
              >
                <div className="flex items-center w-full sm:w-1/2 space-x-4">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Unit Price: Rs {item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Subtotal:{" "}
                      <span className="font-semibold text-green-700">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="px-3 py-1 text-xl bg-gray-200 hover:bg-gray-300 rounded font-bold"
                  >
                    −
                  </button>
                  <span className="text-base font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="px-3 py-1 text-xl bg-gray-200 hover:bg-gray-300 rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total section only shows grand total */}
          <div className="mt-10 w-full bg-green-50 border border-green-200 rounded-xl p-6 shadow-md text-center sm:text-left">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Total Amount
            </h3>
            <p className="text-3xl font-extrabold text-green-700 mb-1">
              Rs {total.toFixed(2)}
            </p>
            <p className="text-sm text-green-600">
              Includes all item subtotals
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className={`w-full text-white px-6 py-3 rounded-xl text-lg transition shadow ${
                checkoutLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {checkoutLoading ? "Processing..." : "Proceed to Payment"}
            </button>

            {checkoutError && (
              <p className="text-red-600 mt-2">{checkoutError}</p>
            )}
            {checkoutSuccess && (
              <p className="text-green-600 mt-2">{checkoutSuccess}</p>
            )}
          </div>
        </>
      )}
      {checkoutSuccess && (
        <PopupMessage
          type="success"
          message={checkoutSuccess}
          onClose={() => setCheckoutSuccess(null)}
        />
      )}

      {checkoutError && (
        <PopupMessage
          type="error"
          message={checkoutError}
          onClose={() => setCheckoutError(null)}
        />
      )}
    </div>
  );
}
