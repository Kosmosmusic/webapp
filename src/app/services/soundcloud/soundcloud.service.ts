/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

import { IEnvironmentInterface } from '../../interfaces/app-environment/app-environment.interface';
import { ISoundcloudPlaylist } from '../../interfaces/soundcloud/soundcloud-playlist.interface';
import { ISoundcloudTracksLinkedPartitioning } from '../../interfaces/soundcloud/soundcloud-tracks-linked-partitioning.interface';

declare let SC: {
  initialize: (arg0: { client_id: string; redirect_uri: string }) => void;
  get: (arg0: string, arg1?: { linked_partitioning: number } | undefined) => Promise<any>;
  stream: (arg0: string) => any;
};

@Injectable({
  providedIn: 'root',
})
export class AppSoundcloudService {
  /**
   * @param http HttpClient
   * @param handlers Custom Http Handlers
   */
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('ENV') private readonly ENV: IEnvironmentInterface,
  ) {
    this.init();
  }

  /**
   * Soundcloud client id.
   */
  private readonly options: {
    client_id: string;
    redirect_uri: string;
  } = {
    client_id: this.ENV.soundcloud.clientId,
    redirect_uri: 'http://dnbhub.com/callback.html', // TODO: replace callback url after API key issue
  };

  /**
   * Shared Soundcloud data.
   */
  public data: { tracks: ISoundcloudTracksLinkedPartitioning; playlist: ISoundcloudPlaylist } = {
    tracks: {
      collection: [],
      next_href: '',
    },
    playlist: {
      kind: '',
      id: 0,
      created_at: '',
      user_id: 0,
      duration: 0,
      sharing: '',
      tag_list: '',
      permalink: '',
      track_count: 0,
      streamable: false,
      downloadable: false,
      embeddable_by: '',
      purchase_url: null,
      label_id: null,
      type: '',
      playlist_type: '',
      ean: '',
      description: '',
      genre: '',
      release: '',
      purchase_title: null,
      label_name: '',
      title: '',
      release_year: null,
      release_month: null,
      release_day: null,
      license: '',
      uri: '',
      permalink_url: '',
      artwork_url: '',
      user: {
        id: 0,
        kind: '',
        permalink: '',
        username: '',
        uri: '',
        permalink_url: '',
        avatar_url: '',
      },
      tracks: [],
    },
  };

  /**
   * Indicates that there's no more tracks to load.
   */
  private noMoreTracks = false;

  /**
   * Soundcloud initialization.
   */
  private init(): void {
    return SC.initialize(this.options);
  }

  /**
   * Returns link with id.
   */
  public getLinkWithId(href: string): string {
    const id = this.options.client_id;
    return `${href}?client_id=${id}`;
  }

  /**
   * Resets Soundcloud service stored data.
   * May be useful later, for now is not used.
   */
  // eslint-disable-next-line max-lines-per-function
  public resetServiceData(): void {
    this.data = {
      tracks: {
        collection: [],
        next_href: '',
      },
      playlist: {
        kind: '',
        id: 0,
        created_at: '',
        user_id: 0,
        duration: 0,
        sharing: '',
        tag_list: '',
        permalink: '',
        track_count: 0,
        streamable: false,
        downloadable: false,
        embeddable_by: '',
        purchase_url: null,
        label_id: null,
        type: '',
        playlist_type: '',
        ean: '',
        description: '',
        genre: '',
        release: '',
        purchase_title: null,
        label_name: '',
        title: '',
        release_year: null,
        release_month: null,
        release_day: null,
        license: '',
        uri: '',
        permalink_url: '',
        artwork_url: '',
        user: {
          id: 0,
          kind: '',
          permalink: '',
          username: '',
          uri: '',
          permalink_url: '',
          avatar_url: '',
        },
        tracks: [],
      },
    };
    this.noMoreTracks = false;
  }

  /**
   * Processes received tracks collection. Saves data to local shared model.
   * Returns full processed collection.
   */
  private processTracksCollection(data: ISoundcloudTracksLinkedPartitioning): any[] {
    const processedTracks = data.collection.map((track: Record<string, unknown>) => {
      track.description = this.processDescription(track.description as string);
      return track;
    });
    // console.log('processedTracks', processedTracks);
    // console.log('this.data.tracks.collection', this.data.tracks.collection);
    const previousCollectionLength: number = this.data.tracks.collection.length;
    for (const track of processedTracks) {
      if (
        !this.data.tracks.collection.filter((item: Record<string, unknown>) => item.id === track.id)
          .length
      ) {
        this.data.tracks.collection.push(track);
      }
    }
    // console.log('this.data.tracks.collection pushed', this.data.tracks.collection);
    if (previousCollectionLength === this.data.tracks.collection.length) {
      this.noMoreTracks = true;
    }
    this.data.tracks.next_href = data.next_href;
    return processedTracks;
  }

  /**
   * Gets user tracks.
   * Performs initial request if data.tracks.next_href is falsy.
   * Calls getTracksNextHref if data.tracks.next_href is truthy.
   * @param userId Soundcloud user id
   */
  public getUserTracks(userId: string) {
    if (this.noMoreTracks) {
      return from([]).toPromise();
    } else if (!this.data.tracks.next_href) {
      return SC.get(`/users/${userId}/tracks`, { linked_partitioning: 1 }).then(
        (data: ISoundcloudTracksLinkedPartitioning) => {
          const processedTracks = this.processTracksCollection(data);
          return processedTracks;
        },
      );
    }
    return this.getTracksNextHref().then(() => this.data.tracks.collection);
  }

  /**
   * Gets user tracks when initial request was already made, and next_href is present in this.data.tracks.
   */
  public getTracksNextHref() {
    const timeoutValue = 10000;
    return this.http
      .get(this.data.tracks.next_href)
      .pipe(
        timeout(timeoutValue),
        take(1),
        map((data: any) => this.processTracksCollection(data)),
        catchError(this.handlers.handleError),
      )
      .toPromise();
  }

  /**
   * Gets soundcloud playlist.
   * @param playlistId Soundcloud playlist id
   */
  public getPlaylist(playlistId: string): Promise<ISoundcloudPlaylist> {
    return SC.get(`/playlists/${playlistId}`).then((playlist: ISoundcloudPlaylist) => {
      playlist.description = this.processDescription(playlist.description);
      playlist.tracks = playlist.tracks.map((track: Record<string, unknown>) => {
        track.description = this.processDescription(track.description as string);
        return track;
      });
      this.data.playlist = playlist;
      return playlist;
    });
  }

  /**
   * Processes soundcloud playlist description.
   * Converts:
   * - \n to <br/>
   * - links to anchors
   */
  private processDescription(unprocessed: string): string {
    if (!unprocessed) {
      return unprocessed;
    }
    const processed = unprocessed
      // parse line breaks
      .replace(/\n/g, '<br/>')
      // parse all urls, full and partial
      .replace(
        /((http(s)?)?(:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/g,
        '<a href="$1" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1</span></a>',
      )
      // add to partial hrefs protocol prefix
      .replace(
        /href="((www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._+~#=]{0,255}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))"/g,
        'href="http://$1"',
      )
      // parse soundcloud account mentions
      .replace(
        /(@)([^@,\s<)\]]+)/g,
        '<a href="https://soundcloud.com/$2" target=_blank><i class="fa fa-external-link"></i> <span class="md-caption">$1$2</span></a>',
      );
    // console.log('processed', processed);
    return processed;
  }

  /**
   * Returns resolved soundcloud track stream object.
   * @param trackId Soundcloud track id
   */
  public streamTrack(trackId: string) {
    return SC.stream(`/tracks/${trackId}`);
  }
}
