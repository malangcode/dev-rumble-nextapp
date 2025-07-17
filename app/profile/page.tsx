"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SkeletonProfile from "@/components/SkeletonProfile";
import { useRouter } from "next/navigation";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import OrderTrackingTab from "@/components/profile/OrderTrackingTab";
import { logout } from "@/utils/auth";

const tabs = ["Orders", "History", "Cancelled", "Tracking", "Profile"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Orders");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [orderHistoryPagination, setOrderHistoryPagination] = useState<any>({});
  const [cancelledOrderPagination, setCancelledOrderPagination] = useState<any>(
    {}
  );
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const res = await axiosWithCsrf.get("/api/get-profile/");
        const ordersRes = await axiosWithCsrf.get("/api/orders/");
        setProfile(res.data);
        setOrders(ordersRes.data.current_orders);
        setHistory(ordersRes.data.order_history);
        setCancelledOrders(ordersRes.data.cancelled_order);
        setOrderHistoryPagination(ordersRes.data.order_history_pagination);
        setCancelledOrderPagination(ordersRes.data.cancelled_order_pagination);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile or orders.");
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, []);

  const fetchOrderPageData = async (
    url: string,
    type: "history" | "cancelled"
  ) => {
    try {
      const response = await axiosWithCsrf.get(url.replace(BASE_URL || "", ""));
      if (type === "history") {
        setHistory(response.data.order_history);
        setOrderHistoryPagination(response.data.order_history_pagination);
      } else {
        setCancelledOrders(response.data.cancelled_order);
        setCancelledOrderPagination(response.data.cancelled_order_pagination);
      }
    } catch (err) {
      console.error("Failed to fetch paginated data:", err);
    }
  };

  if (loading) return <SkeletonProfile />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  const gotoEditPage = () => router.push("/editProfile");

  const handleLogout = async () => {
    await logout();
    // setUser(null);
    router.push("/login");
  };

  return (
    <div style={{backgroundColor: "var(--bg-component)"}}>
      {/* Cover */}
      <div className="relative h-60 sm:h-72 shadow-md">
        <Image
          src="/images/texas-cover.webp"
          alt="Cover"
          layout="fill"
          objectFit="cover"
        
        />
        <div className="absolute bottom-[-80px] left-4 sm:left-10 flex flex-col items-center w-[100px]">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white">
            <Image
              src={
                profile?.profile_pic
                  ? BASE_URL + profile.profile_pic
                  : "/images/profile2.jpg"
              }
              alt="User"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <p className="text-center text-sm mt-1 w-full truncate" style={{color: "var(--text-primary)"}}>
            @{profile?.username || "anonymous"}
          </p>
        </div>
      </div>

      {/* Profile Header */}
      <div className=" pt-24 pb-6 px-4 sm:px-10 shadow" style={{backgroundColor: "var(--bg-card)"}}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{color: "var(--color-primary)"}}>
              {profile?.full_name || "No Name"}
            </h1>
            <p className=" text-sm" style={{color: "var(--text-secondary)"}}>
              {profile?.faculty || "No Faculty Info"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button onClick={gotoEditPage}>Edit Profile</Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-[var(--border-color)] flex gap-6 overflow-x-auto text-sm sm:text-base">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] font-medium border-b-2"
                  : "text-[var(--text-secondary)] hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        {activeTab === "Orders" && (
          <div className=" shadow rounded-lg p-6" style={{backgroundColor: "var(--bg-card)"}}>
            <h2 className="text-xl font-bold mb-4">Current Orders</h2>
            <ul className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-500">You have no current orders.</p>
              ) : (
                orders.map((order) => (
                  <li key={order.id} className="shadow p-4 rounded-md">
                    <p>
                      <strong>Order #{order.id}</strong>
                    </p>
                    <p>
                      {order.items
                        .map(
                          (item: any) =>
                            `${item.quantity}x ${item.product_name}`
                        )
                        .join(", ")}
                    </p>
                    <p className="text-yellow-600 text-sm">
                      Status: {order.status}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {activeTab === "History" && (
          <div className=" shadow rounded-lg p-6" style={{backgroundColor: "var(--bg-card)"}}>
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center">No order history yet.</p>
            ) : (
              <>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-600 border-b">
                      <th className="py-2">Date</th>
                      <th>Items</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-2">
                          {new Date(order.ordered_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td>
                          {order.items
                            .map(
                              (item: any) =>
                                `${item.quantity}x ${item.product_name}`
                            )
                            .join(", ")}
                        </td>
                        <td>Rs. {order.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-700">
                    Showing {history.length} of {orderHistoryPagination.count}{" "}
                    orders
                  </p>
                  <div className="flex gap-2">
                    <Button
                      disabled={!orderHistoryPagination.previous}
                      onClick={() =>
                        fetchOrderPageData(
                          orderHistoryPagination.previous,
                          "history"
                        )
                      }
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={!orderHistoryPagination.next}
                      onClick={() =>
                        fetchOrderPageData(
                          orderHistoryPagination.next,
                          "history"
                        )
                      }
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "Cancelled" && (
          <div className="shadow rounded-lg p-6" style={{backgroundColor: "var(--bg-card)"}}>
            <h2 className="text-xl font-bold mb-4">Cancelled Orders</h2>
            {cancelledOrders.length === 0 ? (
              <p className="text-gray-500">You have no cancelled orders.</p>
            ) : (
              <>
                <ul className="space-y-4">
                  {cancelledOrders.map((order) => (
                    <li
                      key={order.id}
                      className="shadow p-4 rounded-md bg-red-50"
                    >
                      <p>
                        <strong>Order #{order.id}</strong>
                      </p>
                      <p>
                        {order.items
                          .map(
                            (item: any) =>
                              `${item.quantity}x ${item.product_name}`
                          )
                          .join(", ")}
                      </p>
                      <p className="text-red-600 text-sm">
                        Status: {order.status}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    disabled={!cancelledOrderPagination.previous}
                    onClick={() =>
                      fetchOrderPageData(
                        cancelledOrderPagination.previous,
                        "cancelled"
                      )
                    }
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={!cancelledOrderPagination.next}
                    onClick={() =>
                      fetchOrderPageData(
                        cancelledOrderPagination.next,
                        "cancelled"
                      )
                    }
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "Tracking" && (
          <>
            {orders.some((o) =>
              ["pending", "confirmed", "preparing"].includes(o.status)
            ) ? (
              <OrderTrackingTab
                trackingOrders={orders.filter((o) =>
                  ["pending", "confirmed", "preparing"].includes(o.status)
                )}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                No active orders to track.
              </div>
            )}
          </>
        )}

        {activeTab === "Profile" && (
          <>
            <div className="shadow rounded-lg p-6 space-y-2" style={{backgroundColor: "var(--bg-card)"}}>
              <h2 className="text-xl font-bold mb-4">Profile Info</h2>
              <p>
                <strong>Name:</strong> {profile?.full_name || "N/A"}
              </p>
              <p>
                <strong>Student ID:</strong> {profile?.lcid || "N/A"}
              </p>
              <p>
                <strong>Semester:</strong> {profile?.semester || "N/A"}
              </p>
              <p>
                <strong>Department:</strong> {profile?.program || "N/A"}
              </p>
              <p>
                <strong>Faculty:</strong> {profile?.faculty || "N/A"}
              </p>
              <p>
                <strong>Section:</strong> {profile?.section || "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong> {profile?.phone_number || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {profile?.email || "N/A"}
              </p>
              <p>
               <strong>Created at:</strong> {profile?.created_at
                  ? new Date(profile.created_at).toLocaleString("en-US", {
                      month: "long", // June
                      day: "numeric", // 5
                      year: "numeric", // 2025
                      weekday: "short", // Sun
                      hour: "numeric", // 9
                      hour12: true, // PM
                      minute: undefined, // Skip minutes if not needed
                    })
                  : "N/A"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
