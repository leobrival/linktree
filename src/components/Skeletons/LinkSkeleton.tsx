import { Skeleton } from '@/components/ui/skeleton';

export function LinkSkeleton(): React.ReactElement {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        {/* Icon skeleton */}
        <Skeleton className="h-6 w-6 rounded flex-shrink-0" />

        <div className="flex-1 space-y-2">
          {/* Title skeleton */}
          <Skeleton className="h-4 w-32 rounded" />

          {/* Description skeleton */}
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
