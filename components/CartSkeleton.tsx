// components/CartSkeleton.tsx
'use client';

export default function CartSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded shadow-sm animate-pulse"
        >
          <div className="w-20 h-20 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-8 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
      <div className="h-8 bg-gray-300 rounded w-32 ml-auto animate-pulse"></div>
      <div className="h-10 bg-gray-300 rounded w-48 ml-auto animate-pulse"></div>
    </div>
  );
}
