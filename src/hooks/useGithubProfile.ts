/**
 * Custom hook for fetching GitHub user profile and avatar
 */

import { useEffect, useState } from 'react';
import { getGitHubUser, getFallbackAvatarUrl } from '../services/githubApi';

interface UseGithubProfileReturn {
  avatar: string | null;
  loading: boolean;
  error: string | null;
}

export function useGithubProfile(username: string | null | undefined): UseGithubProfileReturn {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const user = await getGitHubUser(username || '');

        if (isMounted) {
          setAvatar(user.avatar_url);
        }
      } catch (err) {
        if (isMounted) {
          console.warn(`Failed to fetch GitHub profile for "${username}". Using fallback avatar.`);
          // Use fallback avatar on error
          setAvatar(getFallbackAvatarUrl(username || ''));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { avatar, loading, error };
}
