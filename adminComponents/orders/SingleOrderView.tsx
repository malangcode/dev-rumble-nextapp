"use client";

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Calendar,
  Users,
  DollarSign,
  List,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useNotification } from "@/context/messageContext";

const SingleOrderView = ({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchSingleOrder = async () => {
      try {
        setLoading(true);
        const response = await axiosWithCsrf.get(
          `/api/admin/orders/${orderId}/`
        );
        setOrder(response.data);
        setPaymentStatus(response.data.payment?.status || "pending");
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchSingleOrder();
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-[85vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        ) : order ? (
          <>
            {/* Scrollable Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Order #{order.id}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">
                    Customer:
                  </span>
                  <span className="text-sm text-gray-600">{order.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">
                    Ordered At:
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(order.ordered_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">
                    Total:
                  </span>
                  <span className="text-sm text-gray-600">
                    Rs {parseFloat(order.total_price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">
                    Status:
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Items:
                </h3>
                <ul className="space-y-2">
                  {order.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between border-b pb-1"
                    >
                      <span className="text-sm text-gray-700">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        Rs {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Info Section (Toggle) */}
              {!showPayment && (
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Paid Amount:</p>
                      <p className="text-base font-medium text-gray-800">
                        Rs {parseFloat(order.total_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="shadow p-2 pb-3 rounded-lg ">
                      <p className="text-sm text-gray-500">Payment Status:</p>
                      <select
                        className="w-full mt-1 bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="fake">Fake Payment</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-500 shadow p-2 rounded-lg mb-1">
                        Remarks: {order.payment.remarks}{" "}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-500 shadow p-2 rounded-lg mb-2">
                        Payment Screenshot is given below if any.
                      </p>

                      {order.payment?.screenshot ? (
                        <>
                          <div className="flex gap-4 shadow p-2 rounded-md mb-2">
                            <button
                              onClick={() =>
                                window.open(order.payment.screenshot, "_blank")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded"
                            >
                              View Screenshot
                            </button>
                          </div>

                          <div className="max-w-full max-h-80 overflow-hidden shadow rounded bg-gray-50 p-2 flex justify-center items-center">
                            <img
                              src={order.payment.screenshot}
                              alt="Payment Screenshot"
                              className="object-contain max-h-72 w-auto"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="border rounded p-2 bg-white text-gray-400 text-sm text-center">
                          (No screenshot uploaded)
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2 mt-4 text-right">
                    <button
                      onClick={async () => {
                        try {
                          setUpdatingPayment(true);
                          await axiosWithCsrf.post(
                            `/api/admin/orders/${orderId}/update-payment-status/`,
                            {
                              status: paymentStatus,
                            }
                          );
                          showNotification(
                            "success",
                            "Payment status updated successfully"
                          );
                        } catch (err) {
                          console.error("Error updating payment status:", err);
                          showNotification(
                            "error",
                            "Failed to update payment status"
                          );
                        } finally {
                          setUpdatingPayment(false);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
                      disabled={updatingPayment}
                    >
                      {updatingPayment
                        ? "Updating..."
                        : "Update Payment Status"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Footer Actions */}
            <div className="bg-white border-t border-gray-200 p-4 flex justify-end gap-3 shrink-0">
              <button
                onClick={async () => {
                  try {
                    const response = await axiosWithCsrf.post(
                      `/api/admin/orders/${orderId}/update-status/`,
                      {
                        status: "confirmed",
                      }
                    );
                    showNotification("success", response.data.message);
                    setOrder((prev: any) => ({ ...prev, status: "confirmed" }));
                  } catch (err: any) {
                    showNotification(
                      "error",
                      err.response?.data?.error || "Failed to confirm order"
                    );
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                disabled={
                  order?.status === "confirmed" || order?.status === "cancelled"
                }
              >
                <CheckCircle className="w-4 h-4" />
                {order?.status === "confirmed"
                  ? "Order Confirmed"
                  : "Confirm Order"}
              </button>

              <button
                onClick={async () => {
                  try {
                    const response = await axiosWithCsrf.post(
                      `/api/admin/orders/${orderId}/update-status/`,
                      {
                        status: "cancelled",
                      }
                    );
                    alert(response.data.message);
                    setOrder((prev: any) => ({ ...prev, status: "cancelled" }));
                  } catch (err: any) {
                    alert(
                      err.response?.data?.error || "Failed to cancel order"
                    );
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                disabled={
                  order?.status === "confirmed" || order?.status === "cancelled"
                }
              >
                <XCircle className="w-4 h-4" />
                {order?.status === "cancelled" ? "Order Cancelled" : "Cancel Order"}
              </button>
              <button
                onClick={() => setShowPayment((prev) => !prev)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {!showPayment ? "Hide Payment" : "Payment Status"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-500 text-center">Order not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleOrderView;
