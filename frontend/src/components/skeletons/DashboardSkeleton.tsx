import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mx-auto" />
          </Card>
        ))}
      </div>

      {/* Filters + Table */}
      <Card className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-44" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Table Rows */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 items-center"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </Card>
    </div>
  );
}
