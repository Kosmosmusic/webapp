import { StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ISoundcloudMe, meDefaultValues } from '../../interfaces/soundcloud/soundcloud-me.config';
import { ISoundcloudPlaylist } from '../../interfaces/soundcloud/soundcloud-playlist.config';
import {
  ISoundcloudTracksLinkedPartitioning,
  linkedPartitioningDefaultValues,
} from '../../interfaces/soundcloud/soundcloud-tracks-linked-partitioning.config';
import { IActionPayload } from '../../utils/ngxs.util';

export interface ISoundcloudStateModel {
  me: ISoundcloudMe;
  myPlaylists: ISoundcloudPlaylist[];
  tracks: ISoundcloudTracksLinkedPartitioning;
  playlists: ISoundcloudPlaylist[];
}

export type TSoundcloudPayload = IActionPayload<Partial<ISoundcloudStateModel>>;

export interface ISoundcloudService {
  me$: Observable<ISoundcloudMe>;
  myPlaylists$: Observable<ISoundcloudPlaylist[]>;
  tracks$: Observable<ISoundcloudTracksLinkedPartitioning>;
  playlists$: Observable<ISoundcloudPlaylist[]>;
}

export const soundcloudStoreInitialState: ISoundcloudStateModel = {
  me: { ...meDefaultValues },
  myPlaylists: [],
  tracks: { ...linkedPartitioningDefaultValues },
  playlists: [],
};

export const SOUNDCLOUD_STATE_TOKEN = new StateToken<ISoundcloudStateModel>('soundcloud');
