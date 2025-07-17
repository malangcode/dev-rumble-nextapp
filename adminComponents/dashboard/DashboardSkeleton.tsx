import React from 'react';

const DashboardSkeleton = () => {
  
  // Skeleton animation component
  const SkeletonBox = ({ className = "", rounded = "rounded-lg" }) => (
    <div className={`bg-[var(--gray-200)] animate-pulse ${rounded} ${className}`}></div>
  );

  // Skeleton card for stats
  const SkeletonStatsCard = () => (
    <div className="bg-[var(--bg-card)] backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[var(--gray-200)] ">
      <div className="w-12 h-12 bg-[var(--gray-200)] rounded-xl animate-pulse mb-4"></div>
      <SkeletonBox className="h-4 w-20 mb-2" />
      <SkeletonBox className="h-8 w-16 mb-1" />
      <SkeletonBox className="h-3 w-12" />
    </div>
  );

  // Skeleton for quick metrics
  const SkeletonQuickMetric = () => (
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-[var(--gray-200)] animate-pulse w-8 h-8"></div>
      <div>
        <SkeletonBox className="h-3 w-20 mb-1" />
        <SkeletonBox className="h-5 w-8" />
      </div>
    </div>
  );

  // Skeleton for chart containers
  const SkeletonChart = ({ height = "h-72" }) => (
    <div className="bg-[var(--bg-card)] backdrop-blur-sm rounded-2xl shadow-sm border border-[var(--gray-200)] p-6">
      <SkeletonBox className="h-6 w-40 mb-6" />
      <div className={`${height} bg-[var(--bg-icon)] rounded-lg animate-pulse flex items-center justify-center`}>
        <div className="text-[var(--text-secondary)] text-sm">Loading chart...</div>
      </div>
    </div>
  );

  // Skeleton for list items (recent orders, staff, inventory)
  const SkeletonListItem = () => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-component)] ">
      <div className="flex-1">
        <SkeletonBox className="h-4 w-24 mb-1" />
        <SkeletonBox className="h-3 w-20" />
      </div>
      <div className="text-right">
        <SkeletonBox className="h-4 w-16 mb-1" />
        <SkeletonBox className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );

  interface SkeletonListContainerProps {
    title: string;
  }

  const SkeletonListContainer = ({ title }: SkeletonListContainerProps) => (
    <div className="bg-[var(--bg-card)] backdrop-blur-sm rounded-2xl shadow-sm border border-[var(--gray-200)] p-6">
      <SkeletonBox className="h-6 w-32 mb-6" />
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonListItem key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-[var(--bg-component)] min-h-screen">
      <div className="mx-auto">
        {/* Refresh Button Skeleton */}
        <div className="flex items-center mb-3 justify-right">
          <div className="w-24 h-8 bg-[var(--gray-200)] rounded animate-pulse"></div>
        </div>
        {/* Header Skeleton */}
        <div className="mb-8">
          <SkeletonBox className="h-8 w-80 mb-2" />
          <SkeletonBox className="h-4 w-96" />
        </div>

        {/* Top Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <SkeletonStatsCard key={index} />
          ))}
        </div>

        {/* Quick Metrics Bar Skeleton */}
        <div className="bg-[var(--bg-card)] backdrop-blur-sm rounded-2xl shadow-sm border border-[var(--gray-200)] p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <SkeletonQuickMetric key={index} />
            ))}
          </div>
        </div>

        {/* Charts Section Skeleton - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SkeletonChart />
          <SkeletonChart />
        </div>

        {/* Charts Section Skeleton - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SkeletonChart />
          <SkeletonChart />
        </div>

        {/* Recent Activity & Performance Metrics Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SkeletonListContainer title="Recent Orders" />
          <SkeletonListContainer title="Staff Performance" />
          <SkeletonListContainer title="Inventory Alerts" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;