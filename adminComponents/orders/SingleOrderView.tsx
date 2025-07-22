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
import { useRole } from "@/context/RoleProvider";
import PrepareDurationModal from "./PrepareDurationModal";

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
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [refundingOrder, setRefundingOrder] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  const { showNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasPermission } = useRole();

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
      <div className="bg-[var(--bg-card)] rounded-xl shadow-xl w-full max-w-3xl h-[85vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-red-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)] " />
            <p className="mt-2 text-[var(--text-secondary)]">
              Loading order details...
            </p>
          </div>
        ) : order ? (
          <>
            {/* Scrollable Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1 space-y-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] ">
                Order #{order.id}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--text-secondary)] " />
                  <span className="text-sm font-medium text-[var(--text-primary] ">
                    Customer:
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] ">
                    {order.user}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--text-secondary)] " />
                  <span className="text-sm font-medium text-[var(--text-primary] ">
                    Ordered At:
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] ">
                    {new Date(order.ordered_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[var(--text-secondary)] " />
                  <span className="text-sm font-medium text-[var(--text-primary] ">
                    Total:
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] ">
                    Rs {parseFloat(order.total_price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-[var(--text-secondary)] " />
                  <span className="text-sm font-medium text-[var(--text-primary] ">
                    Status:
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary] mb-2">
                  Items:
                </h3>
                <ul className="space-y-2">
                  {order.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between border-b pb-1"
                    >
                      <span className="text-sm text-[var(--text-primary)] ">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)] ">
                        Rs {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Info Section (Toggle) */}
              {!showPayment && (
                <div className="bg-[var(--bg-component)] rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-[var(--text-primary] mb-2">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[var(--text-secondary] ">
                        Paid Amount:
                      </p>
                      <p className="text-base font-medium text-[var(--text-primary] ">
                        Rs {parseFloat(order.total_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="shadow p-2 pb-3 rounded-lg ">
                      <p className="text-sm text-[var(--text-secondary] ">
                        Payment Status:
                      </p>
                      <select
                        className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--gray-200)] rounded px-3 py-2 text-sm"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="fake">Fake Payment</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refund Payment</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-[var(--text-secondary] shadow p-2 rounded-lg mb-1">
                        Remarks: {order.payment.remarks}{" "}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-[var(--text-secondary] shadow p-2 rounded-lg mb-2">
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

                          <div className="max-w-full max-h-80 overflow-hidden shadow rounded bg-[var(--bg-component)] p-2 flex justify-center items-center">
                            <img
                              src={order.payment.screenshot}
                              alt="Payment Screenshot"
                              className="object-contain max-h-72 w-auto"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="border rounded p-2 bg-[var(--bg-card)] text-[var(--text-secondary)] text-sm text-center">
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
                      className="bg-[var(--color-primary)] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
                      disabled={updatingPayment || order.payment.status === paymentStatus}
                    >
                      {updatingPayment
                        ? "Updating..." 
                        : order.payment.status !== "pending"
                        ? "Payment Status Updated"
                        : "Update Payment Status"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Footer Actions */}
            <div className="bg-[var(--bg-card)] border-t border-[var(--gray-200)] p-4 flex justify-end gap-3 shrink-0">
              {hasPermission("manage_orders") && (
                <div className="flex gap-3 w-full flex-wrap justify-end">
                  <button
                    onClick={async () => {
                      try {
                        setRefundingOrder(true);
                        const response = await axiosWithCsrf.post(
                          `/api/admin/orders/${orderId}/update-status/`,
                          {
                            status: "refunded",
                          }
                        );
                        showNotification("success", response.data.message);
                        setOrder((prev: any) => ({
                          ...prev,
                          status: "refunded",
                        }));
                      } catch (err: any) {
                        showNotification(
                          "error",
                          err.response?.data?.error || "Failed to refund order"
                        );
                      } finally {
                        setRefundingOrder(false);
                      }
                    }}
                    className="bg-amber-900 hover:bg-amber-950 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                    disabled={
                      order?.status === "refunded" ||
                      order?.status === "delivered" ||
                      order?.status === "preparing" ||
                      refundingOrder ||
                      paymentStatus !== "paid"
                    }
                  >
                    <CheckCircle className="w-4 h-4" />

                    {refundingOrder
                      ? "refunding..."
                      : order?.status === "refunded"
                      ? "Order Refunded"
                      : "Refund Order"}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        setConfirmingDelivery(true);
                        const response = await axiosWithCsrf.post(
                          `/api/admin/orders/${orderId}/update-status/`,
                          {
                            status: "delivered",
                          }
                        );
                        showNotification("success", response.data.message);
                        setOrder((prev: any) => ({
                          ...prev,
                          status: "delivered",
                        }));
                      } catch (err: any) {
                        showNotification(
                          "error",
                          err.response?.data?.error || "Failed to deliver order"
                        );
                      } finally {
                        setConfirmingDelivery(false);
                      }
                    }}
                    className="bg-blue-700 hover:bg-blue-800 text-gray-100 text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                    disabled={
                      order?.status === "refunded" ||
                      order?.status === "delivered" ||
                      confirmingDelivery ||
                      paymentStatus !== "paid"
                    }
                  >
                    <CheckCircle className="w-4 h-4" />

                    {confirmingDelivery
                      ? "delivering..."
                      : order?.status === "delivered"
                      ? "Order Delivered"
                      : "Deliver Order"}
                  </button>


                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                    disabled={
                      order?.status === "preparing" ||
                      order?.status === "delivered" ||
                      paymentStatus !== "paid"
                    }
                  >
                    <CheckCircle className="w-4 h-4" />
                    {order?.status === "preparing"
                      ? "Preparing Order"
                      : "Prepare Order"}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        setConfirmingOrder(true);
                        const response = await axiosWithCsrf.post(
                          `/api/admin/orders/${orderId}/update-status/`,
                          {
                            status: "confirmed",
                          }
                        );
                        showNotification("success", response.data.message);
                        setOrder((prev: any) => ({
                          ...prev,
                          status: "confirmed",
                        }));
                      } catch (err: any) {
                        showNotification(
                          "error",
                          err.response?.data?.error || "Failed to confirm order"
                        );
                      }
                      finally{
                        setConfirmingOrder(false);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                    disabled={
                      order?.status === "confirmed" ||
                      order?.status === "cancelled" ||
                      order?.status === "refunded" ||
                      order?.status === "preparing" ||
                      order?.status === "delivered" ||
                      confirmingOrder ||
                      paymentStatus !== "paid"
                    }
                  >
                    <CheckCircle className="w-4 h-4" />
                    {confirmingOrder? "Confirming...": order?.status === "confirmed"
                      ? "Order Confirmed"
                      : "Confirm Order"}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        setCancellingOrder(true);
                        const response = await axiosWithCsrf.post(
                          `/api/admin/orders/${orderId}/update-status/`,
                          {
                            status: "cancelled",
                          }
                        );
                        alert(response.data.message);
                        setOrder((prev: any) => ({
                          ...prev,
                          status: "cancelled",
                        }));
                      } catch (err: any) {
                        alert(
                          err.response?.data?.error || "Failed to cancel order"
                        );
                      } finally {
                        setCancellingOrder(false);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                    disabled={
                      order?.status === "cancelled" ||
                      order?.status === "delivered" ||

                      cancellingOrder
                    }
                  >
                    <XCircle className="w-4 h-4" />
                    {cancellingOrder
                      ? "Cancelling..."
                      : order?.status === "cancelled"
                      ? "Order Cancelled"
                      : "Cancel Order"}
                  </button>

                  <button
                    onClick={() => setShowPayment((prev) => !prev)}
                    className="bg-[var(--color-primary)] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {!showPayment ? "Hide Payment" : "Payment Status"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-500 text-center">Order not found.</p>
          </div>
        )}
      </div>
      <PrepareDurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={orderId}
        onPrepared={() => {
          setOrder((prev: any) => ({ ...prev, status: "preparing" }));
        }}
        showNotification={showNotification}
      />
      ;
    </div>
  );
};

export default SingleOrderView;
