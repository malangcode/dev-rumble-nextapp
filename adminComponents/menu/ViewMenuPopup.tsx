"use client";

import { X, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

interface ViewMenuPopupProps {
  menuId: number | string;
  onClose: () => void;
}

interface MenuData {
  id: number;
  name: string;
  desc: string;
  price: string;
  category_name: string;
  is_active: boolean;
  is_featured: boolean;
  image: string;
}

export default function ViewMenuPopup({ menuId, onClose }: ViewMenuPopupProps) {
  const [menu, setMenu] = useState<MenuData | null>(null);

  useEffect(() => {
    if (menuId) fetchMenu();
  }, [menuId]);

  const fetchMenu = async () => {
    try {
      const res = await axiosWithCsrf.get(`/api/admin/products/${menuId}/`);
      setMenu(res.data);
    } catch (err) {
      console.error("Failed to fetch menu");
    }
  };

  if (!menu) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative overflow-x-auto h-fit">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Menu Item #{menu.id}</h2>

        <div className="space-y-3">
          <div className="flex gap-2 align-item-center p-2 shadow rounded border border-gray-200">
            <p className="text-base font-medium text-gray-600">Name:</p>
            <p className="text-base font-semibold">{menu.name}</p>
          </div>

          <div className="flex gap-2 align-item-center p-2 shadow rounded border border-gray-200">
            <p className="text-base font-medium text-gray-600">Description:</p>
            <p className="text-base">{menu.desc}</p>
          </div>

          <div className="flex gap-2 align-item-center p-2 shadow rounded border border-gray-200">
            <p className="text-base font-medium text-gray-600">Price (Rs):</p>
            <p className="text-base font-semibold">Rs {menu.price}</p>
          </div>

          <div className="flex gap-2 align-item-center p-2 shadow rounded border border-gray-200">
            <p className="text-base font-medium text-gray-600">Category:</p>
            <p className="text-base">{menu.category_name}</p>
          </div>

          <div className="flex-col gap-4 shadow rounded-lg p-4 border border-gray-200">
            <div className="flex gap-4 text-sm pt-1 pb-3 pr-3 mb-2">
              <span
                className={`px-2 py-1 rounded ${
                  menu.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {menu.is_active ? "Active" : "Inactive"}
              </span>
              <span
                className={`px-2 py-1 rounded ${
                  menu.is_featured
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {menu.is_featured ? "Featured" : "Not Featured"}
              </span>
            </div>

            {/* Image */}
            <div className="flex-col w-fit p-2 border border-gray-200 rounded-md">
              <p className="text-sm text-center font-medium text-gray-600 mb-2">Product photo</p>
              {menu.image ? (
                <img
                  src={menu.image}
                  alt="Menu"
                  className="w-32 h-32 object-cover rounded shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-md text-gray-400">
                  <Camera className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
