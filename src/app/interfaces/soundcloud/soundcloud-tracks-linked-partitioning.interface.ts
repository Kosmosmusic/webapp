/**
 * Soundcloud tracks collection with linked partitioning interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#tracks
 */
export interface ISoundcloudTracksLinkedPartitioning {
  collection: Record<string, unknown>[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  next_href: string;
}
