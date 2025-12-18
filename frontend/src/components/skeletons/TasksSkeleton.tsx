import { Skeleton } from "@/components/ui/skeleton";

export default function TasksSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Table */}
      <div className="rounded-xl border p-4 space-y-4">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4"
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10 ml-auto" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  );
}
