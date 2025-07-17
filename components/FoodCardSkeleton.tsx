'use client';

export function FoodCardSkeleton() {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-[var(--bg-card)] flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-[var(--gray-300)] rounded-t" />

      {/* Content placeholder */}
      <div className="px-6 py-4 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 bg-[var(--gray-300)] rounded w-3/4 mb-3"></div>
        {/* Description */}
        <div className="h-4 bg-[var(--gray-300)] rounded w-full mb-2"></div>
        <div className="h-4 bg-[var(--gray-300)] rounded w-5/6 mb-6"></div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price */}
          <div className="h-6 w-16 bg-[var(--gray-300)] rounded"></div>
          {/* Button */}
          <div className="h-8 w-24 bg-[var(--gray-300)] rounded"></div>
        </div>
      </div>
    </div>
  );
}
