/**
 * Service for fetching GitHub user profile data and avatar
 */

import type { GitHubUser } from './types';

const GITHUB_API_BASE = 'https://api.github.com';
const FALLBACK_AVATAR = 'https://unavatar.io/github/';

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  if (!username) {
    throw new Error('GitHub username is required');
  }

  try {
    const url = `${GITHUB_API_BASE}/users/${username}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'linktree-app',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`GitHub user "${username}" not found`);
      }
      throw new Error(`Failed to fetch GitHub profile: ${response.status}`);
    }

    const user: GitHubUser = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw error;
  }
}

export function getAvatarUrl(username: string): string {
  // Return the GitHub API avatar URL
  return `https://avatars.githubusercontent.com/u/username?v=4`.replace('username', username);
}

export function getFallbackAvatarUrl(username: string): string {
  // Return fallback avatar from unavatar service
  return `${FALLBACK_AVATAR}${username}`;
}
