const AdminPaymentsSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 animate-pulse">
        {/* Refresh Button Skeleton */}
        <div className="flex items-center mb-3 justify-right">
          <div className="w-24 h-8 bg-[var(--gray-200)] rounded animate-pulse"></div>
        </div>
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-36 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-wrap gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-40 bg-gray-200 rounded" />
        ))}
        <div className="h-10 w-32 bg-blue-200 rounded" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-12 bg-gray-100" />
        <div className="divide-y divide-gray-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-9 gap-4 px-6 py-4">
              {[...Array(9)].map((__, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-16 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
};

export default AdminPaymentsSkeleton;
