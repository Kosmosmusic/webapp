import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { ISoundcloudService } from './soundcloud.interface';
import { AppSoundcloudState, soundcloudActions } from './soundcloud.store';
import { AppSoundcloudApiService } from './soundcloud-api.service';

@Injectable({
  providedIn: 'root',
})
export class AppSoundcloudService implements ISoundcloudService {
  constructor(private readonly store: Store, private readonly api: AppSoundcloudApiService) {}

  public readonly me$ = this.store.select(AppSoundcloudState.getMe);

  public readonly myPlaylists$ = this.store.select(AppSoundcloudState.getMyPlaylists);

  public readonly tracks$ = this.store.select(AppSoundcloudState.getTracks);

  public readonly playlists$ = this.store.select(AppSoundcloudState.getPlaylists);

  /**
   * TODO: types, and store wiring
   */
  public connect() {
    return this.api.connect();
  }

  public getMe(userId?: number) {
    return this.api
      .getMe(userId)
      .pipe(
        concatMap(me =>
          this.store.dispatch(new soundcloudActions.setSoundcloudState({ me })).pipe(mapTo(me)),
        ),
      );
  }

  public getMyPlaylists(userId: number) {
    return this.api
      .getMyPlaylists(userId)
      .pipe(
        concatMap(myPlaylists =>
          this.store
            .dispatch(new soundcloudActions.setSoundcloudState({ myPlaylists }))
            .pipe(mapTo(myPlaylists)),
        ),
      );
  }

  public getTracks(userId: number) {
    return this.api
      .getUserTracks(userId)
      .pipe(
        concatMap(tracks =>
          this.store
            .dispatch(new soundcloudActions.setSoundcloudState({ tracks }))
            .pipe(mapTo(tracks)),
        ),
      );
  }

  public getPlaylist(playlistId: number) {
    return this.api.getPlaylist(playlistId).pipe(
      concatMap(playlist =>
        this.store
          .selectOnce(AppSoundcloudState.getPlaylists)
          .pipe(map(existingPlaylists => ({ playlist, existingPlaylists }))),
      ),
      concatMap(({ playlist, existingPlaylists }) => {
        const playlists = [...existingPlaylists, playlist];
        return this.store
          .dispatch(new soundcloudActions.setSoundcloudState({ playlists }))
          .pipe(mapTo(playlist));
      }),
    );
  }

  public streamTrack(trackId: number) {
    return this.api.streamTrack(trackId);
  }

  public getLinkWithId(href: string) {
    return this.api.getLinkWithId(href);
  }

  public resetData() {
    this.api.resetServiceData(); // TODO: this should be removed eventually
  }
}
