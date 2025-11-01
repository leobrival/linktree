import type { Link } from '@/services/types';
import { LinkButton } from './LinkButton';
import { LinkSkeleton } from './Skeletons/LinkSkeleton';

interface LinksListProps {
  links: Link[] | null;
  loading: boolean;
  error?: string | null;
}

const SKELETON_COUNT = 5;

export function LinksList({ links, loading, error }: LinksListProps): React.ReactElement {
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (loading || !links) {
    return (
      <div className="space-y-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <LinkSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Sort links by order property
  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  if (sortedLinks.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No links available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedLinks.map((link) => (
        <LinkButton key={link.id} link={link} />
      ))}
    </div>
  );
}
