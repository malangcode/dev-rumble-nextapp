'use client';

export default function CheckoutSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      <h1 className="text-2xl font-semibold mb-6 bg-[var(--gray-200)] rounded w-48 h-8"></h1>

      <div className="space-y-4">
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="flex flex-wrap md:flex-nowrap items-center justify-between bg-[var(--bg-icon)] rounded-lg p-4 gap-4"
          >
            {/* Image + Name/Price Block */}
            <div className="flex items-center space-x-4 flex-1 min-w-[200px]">
              <div className="h-16 w-16 bg-[var(--gray-300)] rounded" />
              <div>
                <div className="h-5 w-32 md:w-48 bg-[var(--gray-300)] rounded mb-2"></div>
                <div className="h-4 w-16 md:w-24 bg-[var(--gray-300)] rounded"></div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-3 min-w-[100px]">
              <div className="h-8 w-8 bg-[var(--gray-300)] rounded"></div>
              <div className="h-5 w-5 bg-[var(--gray-300)] rounded"></div>
              <div className="h-8 w-8 bg-[var(--gray-300)] rounded"></div>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[80px]">
              <div className="h-4 w-16 bg-[var(--gray-300)] rounded mb-1"></div>
              <div className="h-6 w-20 bg-[var(--gray-300)] rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Total + Proceed Button */}
      <div className="mt-8 border-t pt-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="h-6 w-24 bg-[var(--gray-300)] rounded mb-2"></div>
          <div className="h-8 w-32 bg-[var(--gray-300)] rounded"></div>
        </div>
        <div className="h-10 w-48 bg-[var(--gray-300)] rounded"></div>
      </div>
    </div>
  );
}
