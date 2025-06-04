'use client';

export default function SkeletonProfile() {
  return (
    <div className="animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-60 sm:h-72 bg-gray-300 rounded-b-xl relative">
        <div className="absolute bottom-[-50px] left-4 sm:left-10">
          <div className="w-[100px] h-[100px] rounded-full border-4 border-white bg-gray-400" />
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="bg-white pt-16 pb-6 px-4 sm:px-10 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-6 bg-gray-300 w-40 mb-2 rounded" />
            <div className="h-4 bg-gray-200 w-60 rounded" />
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <div className="h-10 w-24 bg-gray-300 rounded" />
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-6 flex gap-6 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="h-5 w-32 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
