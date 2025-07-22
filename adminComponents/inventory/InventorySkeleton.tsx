import { Boxes } from "lucide-react";

const InventorySkeleton = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen animate-pulse">
        {/* Refresh Button Skeleton */}
        <div className="flex items-center mb-3 justify-right">
          <div className="w-24 h-8 bg-[var(--gray-200)] rounded animate-pulse"></div>
        </div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-28 bg-gray-300 rounded" />
          <div className="h-10 w-28 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="h-4 w-32 bg-gray-200 mb-4 rounded" />
          <div className="h-48 bg-gray-100 rounded" />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="h-4 w-32 bg-gray-200 mb-4 rounded" />
          <div className="flex justify-center items-center">
            <div className="h-48 w-48 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="h-10 w-64 bg-gray-200 rounded" />
        <div className="h-10 w-40 bg-gray-200 rounded" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Boxes className="w-5 h-5 text-gray-400" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </h2>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 items-center">
              <div className="h-4 bg-gray-200 rounded col-span-1" />
              <div className="h-4 bg-gray-200 rounded col-span-1" />
              <div className="h-4 bg-gray-200 rounded col-span-1" />
              <div className="h-4 bg-gray-200 rounded col-span-1" />
              <div className="h-4 bg-gray-200 rounded col-span-1" />
              <div className="h-4 bg-gray-300 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventorySkeleton;
