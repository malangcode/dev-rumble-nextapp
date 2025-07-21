"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, RefreshCcw, Eye, Plus, Edit2 } from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useNotification } from "@/context/messageContext";
import ProductEditPopup from "./ProductEditPopup";
import CreateProductPopup from "./CreateProductPopup";
import ViewMenuPopup from "./ViewMenuPopup";
import { useDebounce } from "use-debounce";

interface MenuItem {
  id: number;
  name: string;
  price: string;
  desc: string;
  category: string | null;
  category_name: string | null;
  is_active: boolean;
  created_at: string;
  image: string;
}

const AdminMenuComponent = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { showNotification } = useNotification();
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const fetchMenuItems = async (showloading = true) => {
    try {
      if (showloading) setLoading(true);
      const params: any = { page, limit };
      if (search) params.search = search;
      if (statusFilter !== "all") params.is_active = statusFilter === "active";

      const response = await axiosWithCsrf.get("api/admin/products/", {
        params,
      });
      setMenuItems(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        ((err as any).response.status === 404 ||
          (err as any).response.status === 500 ||
          (err as any).response.data?.detail === "Invalid page.")
      ) {
        setPage(1);
        return;
      }
      console.error("Error fetching menu:", err);
      showNotification("error", "Failed to fetch menu items");
    } finally {
      if (showloading) setLoading(false);
    }
  };

  const firstRun = useRef(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMenuItems(firstRun.current);
      firstRun.current = false;
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [debouncedSearch, statusFilter, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg-component)] py-2 px-6 overflow-hidden animate-pulse">
        <div className="py-4 border-[var(--gray-200)] mb-2 bg-[var(--bg-component)] ">
          {/* Refresh Button Skeleton */}
          <div className="flex items-center mb-2 justify-right">
            <div className="w-24 h-8 bg-[var(--gray-200)] rounded animate-pulse"></div>
          </div>

          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--gray-200)] rounded-lg animate-pulse w-10 h-10" />
              <div>
                <div className="h-6 bg-[var(--gray-200)] rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-[var(--gray-200)] rounded w-64 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="h-8 bg-[var(--gray-200)] rounded w-30 mb-2 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg-card)] flex gap-4 rounded-xl shadow-sm border border-[var(--gray-200)] p-6  animate-pulse h-20">
            <div className="h-8 w-80 bg-[var(--bg-icon)] shadow-sm rounded-lg animate-pulse"></div>
            <div className="h-8 w-30 bg-[var(--bg-icon)] shadow-sm rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-component)] border-b border-[var(--gray-200)] ">
                <tr>
                  {Array(8)
                    .fill(0)
                    .map((_, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase"
                      >
                        &nbsp;
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--gray-200)] ">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="hover:bg-[var(--bg-component)] ">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-[--gray-200] rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 bg-[--gray-200] rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-[--gray-200] rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-[--gray-200] rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-[--gray-200] rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-[--gray-200] rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-[--gray-200] rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-[--gray-200] rounded-full"></div>
                          <div className="w-6 h-6 bg-[--gray-200] rounded-full"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 bg-[var(--bg-component)] min-h-screen">
      <div className="flex items-center mb-3 gap-4">
        <button
          onClick={() => fetchMenuItems(true)}
          className="flex items-center gap-1 text-sm px-3 py-2 bg-[var(--gray-200)] hover:bg-[--gray-300] rounded text-[var(--text-secondary)]"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block p-2 bg-[var(--blue-100)] rounded-lg">
            <ClipboardList className="w-6 h-6 text-[var(--color-primary)] " />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] ">
              Menu Management
            </h1>
            <p className="text-[var(--text-secondary)] ">
              Manage and track all menu items
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreatePopup(true)}
          className="px-4 w-fit py-2 my-2 sm:my-0 bg-[var(--color-primary)] text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>

        {showCreatePopup && (
          <CreateProductPopup
            onClose={() => setShowCreatePopup(false)}
            onSuccess={fetchMenuItems}
          />
        )}
      </div>

      {/* search and filter bar  */}
      <div className="flex items-center gap-4 mb-4 bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--gray-200)] ">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items by name..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--gray-300)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)] transition"
          />
          <div className="absolute left-3 top-2.5 text-[var(--text-secondary)] ">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.5-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 shadow py-2 border border-[var(--gray-300)] rounded-lg"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--gray-200)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--gray-200)] bg-[var(--bg-component)] ">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] ">
            All Menu Items ({menuItems.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-component)] border-b border-[var(--gray-200)] ">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)] divide-y divide-[var(--gray-200)] ">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-component)] ">
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)] ">
                    #{item.id}
                  </td>
                  <td className="px-6 py-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[var(--bg-icon)] border rounded flex items-center justify-center text-gray-400 text-sm">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)] ">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)] ">
                    Rs {item.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-primary)] ">
                    {item.category_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)] ">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      className="text-[var(--color-primary)] hover:text-blue-900 mr-3"
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowViewPopup(true);
                      }}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedItemId !== null && (
          <ProductEditPopup
            productId={selectedItemId}
            onClose={() => setSelectedItemId(null)}
          />
        )}

        {showViewPopup && selectedId !== null && (
          <ViewMenuPopup
            menuId={selectedId as string | number}
            onClose={() => setShowViewPopup(false)}
          />
        )}

        {menuItems.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] ">
              No menu items found.
            </p>
          </div>
        )}

        <div className="flex mt-6 border-t border-[var(--gray-200)] p-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`mx-1 px-3 py-1 rounded border text-sm ${
                page === p
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary))]"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--gray-300)] hover:bg-[var(--bg-icon)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMenuComponent;
