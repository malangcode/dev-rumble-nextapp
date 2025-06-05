"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SkeletonProfile from "@/components/SkeletonProfile"; // adjust path accordingly
import { useRouter } from "next/navigation";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf"; // Assuming you have axiosWithCsrf like in EditProfilePage

const tabs = ["Orders", "History", "Tracking", "Profile"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Orders");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosWithCsrf.get("/api/get-profile/");
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <SkeletonProfile />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  const gotoEditPage = () => {
    router.push("/editProfile");
  };

  return (
    <div className="bg-gray-100">
      {/* Cover Section */}
      <div className="relative h-60 sm:h-72 bg-white shadow-md">
        <Image
          src="/images/cover.png"
          alt="Cover"
          layout="fill"
          objectFit="cover"
          className="rounded-b-xl"
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
          <p className="text-center text-sm text-gray-600 mt-1 w-full truncate">
            @{profile?.username || "anonymous"}
          </p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white pt-24 pb-6 px-4 sm:px-10 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              {profile?.full_name || "No Name"}
            </h1>
            <p className="text-gray-600 text-sm">
              {profile?.faculty || "No Faculty Info"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button onClick={gotoEditPage} variant="default">
              Edit Profile
            </Button>
            <Button variant="outline">Logout</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 flex gap-6 overflow-x-auto text-sm sm:text-base">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-700 font-medium border-b-2"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        {activeTab === "Orders" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Current Orders</h2>
            {/* You can fetch orders dynamically later if you want */}
            <ul className="space-y-4">
              <li className="border p-4 rounded-md">
                <p>
                  <strong>Order #2345</strong>
                </p>
                <p>2x Veg Chowmein, 1x Lassi</p>
                <p className="text-yellow-600 text-sm">Status: Preparing</p>
              </li>
              <li className="border p-4 rounded-md">
                <p>
                  <strong>Order #2346</strong>
                </p>
                <p>1x Cheese Burger, 1x Coke</p>
                <p className="text-green-600 text-sm">
                  Status: Ready for Pickup
                </p>
              </li>
            </ul>
          </div>
        )}

        {activeTab === "History" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-2">Date</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">May 31, 2025</td>
                  <td>Pizza, Cold Coffee</td>
                  <td>Rs. 450</td>
                </tr>
                <tr>
                  <td className="py-2">May 30, 2025</td>
                  <td>Chowmein, Iced Tea</td>
                  <td>Rs. 300</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Tracking" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Track Your Order</h2>
            <div className="flex flex-col space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p>
                  <strong>Order #2346</strong>
                </p>
                <p className="text-sm">Expected Pickup: 10 mins</p>
                <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 w-[80%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <p>
                  <strong>Order #2345</strong>
                </p>
                <p className="text-sm">Expected Pickup: 5 mins</p>
                <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 w-[60%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Profile" && (
          <div className="bg-white shadow rounded-lg p-6 space-y-2">
            <h2 className="text-xl font-bold mb-4">Profile Info</h2>
            <p>
              <strong>Name:</strong> {profile?.full_name || "N/A"}
            </p>
            <p>
              <strong>Student ID:</strong> {profile?.lcid || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {profile?.email || "N/A"}
            </p>
            <p>
              <strong>Department:</strong> {profile?.program || "N/A"}
            </p>
            <p>
              <strong>Faculty:</strong> {profile?.faculty || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong> {profile?.phone_number || "N/A"}
            </p>
            <p>
              <strong>Section:</strong> {profile?.section || "N/A"}
            </p>
            <p>
              <strong>Joined:</strong> {profile?.joined || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
