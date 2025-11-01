import type { LinktreeData } from '@/services/types';
import { ProfileCard } from '@/components/ProfileCard';
import { LinksList } from '@/components/LinksList';

interface HomeProps {
  data: LinktreeData | null;
  avatarUrl: string | null;
  dataLoading: boolean;
  avatarLoading: boolean;
  dataError?: string | null;
}

export function Home({
  data,
  avatarUrl,
  dataLoading,
  avatarLoading,
  dataError,
}: HomeProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container-md">
        {/* Profile Card Section */}
        <ProfileCard
          profile={data?.profile || null}
          avatarUrl={avatarUrl}
          loading={dataLoading || avatarLoading}
          error={dataError}
        />

        {/* Links List Section */}
        <LinksList
          links={data?.links || null}
          loading={dataLoading}
          error={dataError}
        />
      </div>
    </div>
  );
}
