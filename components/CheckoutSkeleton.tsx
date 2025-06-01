'use client';

export default function CheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <h1 className="text-2xl font-semibold mb-6 bg-gray-200 rounded w-48 h-8"></h1>

      <div className="space-y-4">
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-100 rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-300 rounded" />
              <div>
                <div className="h-5 w-48 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-300 rounded"></div>
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 rounded"></div>
            </div>

            <div className="text-right">
              <div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6 flex justify-between items-center">
        <div>
          <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-10 w-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
