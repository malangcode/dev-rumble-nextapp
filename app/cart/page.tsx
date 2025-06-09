"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import CartSkeleton from "@/components/CartSkeleton";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useNotification } from "@/context/messageContext";

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
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();
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
        if (err.response && err.response.status === 404) {
          showNotification(
            "error",
            "Your cart is empty. Please add items first."
          );
          router.push("/menu");
        } else {
          showNotification("error", err.message || "Failed to fetch cart.");
        }
        // setError(err.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return; // prevent invalid qty

    try {
      // Send update to backend
      await axiosWithCsrf.post("/api/cart/update/", {
        cart_item_id: id,
        quantity: newQty,
      });

      // Update frontend state only if backend call successful
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Optional: show some UI error feedback here
    }
  };

  const increaseQty = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    updateQuantity(id, item.quantity + 1);
  };

  const decreaseQty = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    if (item.quantity === 1) return; // or you can remove if quantity 0 allowed
    updateQuantity(id, item.quantity - 1);
  };

  const removeItem = async (id: number) => {
    try {
      await axiosWithCsrf.post("/api/cart/remove/", { cart_item_id: id });
      setCartItems((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
      // Optional: show error feedback
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <CartSkeleton />;

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;


  const gotoCheckout = () => {
    router.push("/checkout"); // replace '/checkout' with your actual checkout route
  };

  return (
    <div className="py-6 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 shadow-md rounded-md max-w-6.5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-blue-700">
        Your Cart
      </h1>

      <BackButton />

      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md p-4 text-sm sm:text-base mb-6">
        <strong>Note:</strong> Please review your items before proceeding to
        checkout. Ensure quantities are correct and items are as expected !.
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg shadow-md bg-white"
            >
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-full sm:w-24 h-24 object-cover rounded-md"
              />

              <div className="flex-1 flex flex-col gap-1">
                <h2 className="font-semibold text-lg sm:text-xl">
                  {item.name}
                </h2>
                <p className="text-gray-600">Rs {item.price.toFixed(2)}</p>

                <div className="flex items-center mt-2 space-x-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-md font-medium">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold text-lg">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 mt-2 sm:mt-0 transition"
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {/* Checkout Section */}
          <div className="text-right mt-8 border-t pt-4">
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              Total: Rs {totalPrice.toFixed(2)}
            </p>
            <button
              disabled={cartItems.length === 0}
              onClick={gotoCheckout}
              className="mt-3 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
