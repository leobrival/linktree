/**
 * Type definitions for Personal Linktree Application
 */

export interface Profile {
  name: string;
  bio: string;
  gitHubUsername: string;
  socialMediaHandle?: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  order: number;
}

export interface LinktreeData {
  version: string;
  profile: Profile;
  links: Link[];
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
