/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Soundcloud playlist interface.
 * API Documentation https://developers.soundcloud.com/docs/api/reference#playlists
 */
export interface ISoundcloudPlaylist {
  kind: string;
  id: number;
  created_at: string;
  user_id: number;
  duration: number;
  sharing: string;
  tag_list: string;
  permalink: string;
  track_count: number;
  streamable: boolean;
  downloadable: boolean;
  embeddable_by: string;
  purchase_url: string | null;
  label_id: string | null;
  type: string;
  playlist_type: string;
  ean: string;
  description: string;
  genre: string;
  release: string;
  purchase_title: string | null;
  label_name: string;
  title: string;
  release_year: string | number | null;
  release_month: string | number | null;
  release_day: string | number | null;
  license: string;
  uri: string;
  permalink_url: string;
  artwork_url: string;
  user: {
    id: number;
    kind: string;
    permalink: string;
    username: string;
    uri: string;
    permalink_url: string;
    avatar_url: string;
  };
  tracks: Record<string, unknown>[];
}
