export interface IBlogPostLinks {
  bandcamp: string;
  facebook: string;
  instagram: string;
  soundcloud: string;
  twitter: string;
  website: string;
  youtube: string;
}

/**
 * Application blog post interface with initialization.
 */
export interface IBlogPost {
  code: string | null;
  links: IBlogPostLinks;
  playlistId: string | null;
  soundcloudUserId: string | null;
  description: string | null;
}
