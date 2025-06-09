"use client";

import { useState, useEffect } from "react";
import CheckoutSkeleton from "@/components/CheckoutSkeleton";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import PopupMessage from "@/components/PopupMessage";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useNotification } from "@/context/messageContext";
import { useAuth } from "@/context/AuthContext";
// import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { FaWallet, FaQrcode, FaStore, FaCamera } from "react-icons/fa";

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
  const { showNotification } = useNotification();
  const [selectedMethod, setSelectedMethod] = useState<string>("wallet");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const { user } = useAuth();

  const paymentMethods = [
    {
      id: "wallet",
      name: "Wallet",
      icon: <FaWallet className="text-lg mr-2" />,
    },
    {
      id: "qr",
      name: "QR Payment",
      icon: <FaQrcode className="text-lg mr-2" />,
    },
    {
      id: "counter",
      name: "On Counter",
      icon: <FaStore className="text-lg mr-2" />,
    },
  ];

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
        // setError(err.message || "Failed to fetch cart");
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

    const formData = new FormData();
    formData.append("method", selectedMethod);
    formData.append("amount", total.toString());

    // Handle QR payment
    if (selectedMethod === "qr") {
      const fileInput = document.getElementById(
        "screenshotInput"
      ) as HTMLInputElement;
      const remarksInput = document.getElementById(
        "remarksInput"
      ) as HTMLInputElement;

      if (fileInput?.files?.length) {
        formData.append("screenshot", fileInput.files[0]);
      } else {
        setCheckoutError("Please upload a screenshot for QR payment.");
        setCheckoutLoading(false);
        return;
      }

      // Append remarks for QR
      if (remarksInput?.value) {
        formData.append("remarks", remarksInput.value);
      } else {
        setCheckoutError("Please enter remarks for QR payment.");
        setCheckoutLoading(false);
        return;
      }
    }

    if (selectedMethod === "wallet") {
      formData.append("remarks", "Paid via wallet");
    }

    try {
      const res = await axiosWithCsrf.post("/api/checkout/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification(
        "success",
        `Order placed successfully! Order ID: ${res.data.order.id}`
      );
      setCartItems([]);
      router.push("/profile");
    } catch (err: any) {
      setCheckoutError(err.response?.data?.error || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <CheckoutSkeleton />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-6 px-4">
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

          {/* payment method */}

          <div className="max-w-6.5xl mx-auto mt-6 bg-white shadow-md rounded-xl p-4 md:p-6">
            {/* Tabs for Small Screens */}
            <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex-shrink-0 flex items-center px-3 py-2 rounded-lg transition duration-200 text-sm ${
                    selectedMethod === method.id
                      ? "bg-blue-100 text-blue-700 shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {method.icon}
                  {method.name}
                </button>
              ))}
            </div>

            {/* Responsive Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              {/* Sidebar (Desktop) */}
              <div className="hidden md:flex md:flex-col gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      selectedMethod === method.id
                        ? "bg-blue-100 text-blue-700 shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {method.icon}
                    {method.name}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="md:col-span-3">
                {selectedMethod === "wallet" && (
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-3">
                      Pay Using Wallet
                    </h2>
                    <p className="text-gray-700 mb-1">
                      Available Balance: <strong>Rs. {user?.wallet_balance} </strong>
                    </p>
                    <p className="text-gray-700">
                      Amount to be deducted: <strong>Rs. {total.toFixed(2)}</strong>
                    </p>
                  </div>
                )}

                {selectedMethod === "qr" && (
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-3">
                      Pay via QR Code
                    </h2>

                    {/* QR Image */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">
                        Scan the QR below:
                      </p>
                      <img
                        src="/images/qr1.jpg" // Replace dynamically
                        alt="QR Code"
                        className="w-40 h-40 shadow p-2 rounded-md"
                      />
                    </div>

                    {/* QR Form */}
                    <div className="grid gap-4">
                      <div>
                        <label className="block mb-1 font-medium text-sm">
                          Amount
                        </label>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={total.toFixed(2)}
                          readOnly
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      {/* Screenshot Upload */}
                      <div>
                        <label className="block mb-1 font-medium text-sm">
                          Upload Screenshot
                        </label>
                        <div className="relative w-40 h-40 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-blue-400">
                          <input
                            id="screenshotInput"
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                          {screenshotPreview ? (
                            <img
                              src={screenshotPreview}
                              alt="Screenshot Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <FaCamera className="text-gray-400 text-3xl" />
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 font-medium text-sm">
                          Remarks
                        </label>
                        <input
                          id="remarksInput"
                          type="text"
                          placeholder="Eg: rahish123 - fee payment"
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === "counter" && (
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-3">
                      Pay at the Counter
                    </h2>
                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md border border-yellow-300">
                      <p className="mb-2">
                        Please visit the office counter to make your payment.
                      </p>
                      <p>
                        <strong>Note:</strong> Tell the admin your{" "}
                        <strong>username</strong> at the counter to get your
                        payment approved.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
