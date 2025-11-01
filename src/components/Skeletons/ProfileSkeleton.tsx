import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton(): React.ReactElement {
  return (
    <div className="text-center mb-8">
      {/* Avatar skeleton */}
      <div className="flex justify-center mb-4">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>

      {/* Name skeleton */}
      <Skeleton className="h-8 w-48 mx-auto mb-3 rounded" />

      {/* Bio skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-64 mx-auto rounded" />
        <Skeleton className="h-4 w-56 mx-auto rounded" />
      </div>

      {/* Social handle skeleton */}
      <Skeleton className="h-3 w-32 mx-auto mt-4 rounded" />
    </div>
  );
}
