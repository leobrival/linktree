/**
 * Service for loading linktree configuration from data.json
 */

import type { LinktreeData } from './types';

export async function loadLinktreeData(): Promise<LinktreeData> {
  try {
    const response = await fetch('/data.json');

    if (!response.ok) {
      throw new Error(`Failed to load data.json: ${response.status}`);
    }

    const data: LinktreeData = await response.json();

    // Validate data structure
    validateLinktreeData(data);

    return data;
  } catch (error) {
    console.error('Error loading linktree data:', error);
    throw error;
  }
}

function validateLinktreeData(data: LinktreeData): void {
  if (!data.profile || !data.links) {
    throw new Error('Invalid data format: missing profile or links');
  }

  const { profile, links } = data;

  // Validate profile
  validateProfile(profile);

  // Validate links
  validateLinks(links);
}

function validateProfile(profile: any): void {
  // Check required fields
  if (!profile.name) {
    throw new Error('Invalid profile: name is required (max 100 characters)');
  }

  if (!profile.bio) {
    throw new Error('Invalid profile: bio is required (max 300 characters)');
  }

  if (!profile.gitHubUsername) {
    throw new Error('Invalid profile: gitHubUsername is required');
  }

  // Check field lengths
  if (profile.name && profile.name.length > 100) {
    console.warn('Warning: Profile name exceeds 100 characters. It may be truncated.');
  }

  if (profile.bio && profile.bio.length > 300) {
    console.warn('Warning: Profile bio exceeds 300 characters. It may be truncated.');
  }

  // Check optional fields
  if (profile.socialMediaHandle && profile.socialMediaHandle.length > 100) {
    console.warn('Warning: Social media handle exceeds 100 characters.');
  }
}

function validateLinks(links: any[]): void {
  // Validate array
  if (!Array.isArray(links) || links.length === 0) {
    throw new Error('Invalid links: must be a non-empty array with at least 1 link');
  }

  // Check count limit
  if (links.length > 50) {
    console.warn(
      `Warning: You have ${links.length} links. Only the first 50 will be displayed. ` +
      'Consider removing some links for better UX.'
    );
  }

  // Validate each link
  links.forEach((link, index) => {
    // Check required fields
    if (!link.id) {
      throw new Error(`Invalid link at index ${index}: id is required (unique identifier)`);
    }

    if (!link.title) {
      throw new Error(`Invalid link at index ${index}: title is required`);
    }

    if (!link.url) {
      throw new Error(`Invalid link at index ${index}: url is required`);
    }

    if (link.order === undefined || link.order === null) {
      throw new Error(`Invalid link at index ${index}: order is required (0, 1, 2, ...)`);
    }

    // Validate URL format
    if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
      console.warn(
        `Warning: Link "${link.title}" (${link.url}) doesn't use http(s) protocol. ` +
        'Links should start with http:// or https://'
      );
    }

    // Check field lengths
    if (link.title && link.title.length > 50) {
      console.warn(`Warning: Link title "${link.title}" exceeds 50 characters.`);
    }

    if (link.description && link.description.length > 100) {
      console.warn(`Warning: Link description for "${link.title}" exceeds 100 characters.`);
    }

    if (link.icon && link.icon.length > 1) {
      console.warn(`Warning: Link icon for "${link.title}" should be a single emoji.`);
    }

    // Check optional fields
    if (!link.icon) {
      console.warn(`Info: Link "${link.title}" doesn't have an icon. Consider adding one for better UX.`);
    }
  });
}
