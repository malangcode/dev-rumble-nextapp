// File: TableManagementSkeleton.tsx
const TableManagementSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 animate-pulse">
      {/* Refresh Button Skeleton */}
      <div className="flex items-center mb-3 justify-right">
        <div className="w-24 h-8 bg-[var(--gray-200)] rounded animate-pulse"></div>
      </div>
      <div className="flex justify-between items-center mb-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <div className="h-10 w-40 bg-blue-200 rounded" />
          <div className="h-10 w-40 bg-green-200 rounded" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-full bg-gray-200 rounded" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg space-y-3 bg-gray-50">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Updates */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50"
          >
            <div className="w-12 h-3 bg-gray-200 rounded" />
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <div className="w-64 h-3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManagementSkeleton;
