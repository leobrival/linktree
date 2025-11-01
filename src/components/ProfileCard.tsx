import type { Profile } from '@/services/types';
import { ProfileSkeleton } from './Skeletons/ProfileSkeleton';

interface ProfileCardProps {
  profile: Profile | null;
  avatarUrl: string | null;
  loading: boolean;
  error?: string | null;
}

export function ProfileCard({ profile, avatarUrl, loading, error }: ProfileCardProps): React.ReactElement {
  if (error) {
    return (
      <div className="text-center mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (loading || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="text-center mb-8">
      {/* Avatar */}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={profile.name}
          className="h-32 w-32 rounded-full mx-auto border-4 border-primary object-cover mb-4"
        />
      )}

      {/* Name */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900">{profile.name}</h1>

      {/* Bio */}
      <p className="text-gray-600 mb-4 text-base leading-relaxed max-w-lg mx-auto">
        {profile.bio}
      </p>

      {/* Social Handle */}
      {profile.socialMediaHandle && (
        <p className="text-sm text-gray-500">{profile.socialMediaHandle}</p>
      )}
    </div>
  );
}
