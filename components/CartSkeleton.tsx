'use client';

export default function CartSkeleton() {
  return (
    <div className="space-y-6 px-2 max-w-4xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-4 rounded shadow-sm animate-pulse bg-gray-100"
        >
          {/* Image */}
          <div className="w-20 h-20 bg-gray-300 rounded flex-shrink-0"></div>

          {/* Details */}
          <div className="flex-1 space-y-3 py-1 min-w-[200px]">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-8 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Price and Remove */}
          <div className="flex flex-col items-end space-y-3 min-w-[80px]">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}

      {/* Total & Checkout */}
      <div className="h-8 bg-gray-300 rounded w-32 ml-auto animate-pulse"></div>
      <div className="h-10 bg-gray-300 rounded w-48 ml-auto animate-pulse"></div>
    </div>
  );
}
