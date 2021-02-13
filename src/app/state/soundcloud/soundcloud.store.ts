import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { setSoundcloudState } from './soundcloud.actions';
import {
  ISoundcloudStateModel,
  soundcloudStoreInitialState,
  TSoundcloudPayload,
} from './soundcloud.interface';

export const soundcloudActions = {
  setSoundcloudState,
};

export const SOUNDCLOUD_STATE_TOKEN = new StateToken<ISoundcloudStateModel>('soundcloud');

@State<ISoundcloudStateModel>({
  name: SOUNDCLOUD_STATE_TOKEN,
  defaults: {
    ...soundcloudStoreInitialState,
  },
})
@Injectable()
export class AppSoundcloudState {
  @Selector()
  public static getState(state: ISoundcloudStateModel) {
    return state;
  }

  @Selector()
  public static getMe(state: ISoundcloudStateModel) {
    return state.me;
  }

  @Selector()
  public static getMyPlaylists(state: ISoundcloudStateModel) {
    return state.myPlaylists;
  }

  @Selector()
  public static getTracks(state: ISoundcloudStateModel) {
    return state.tracks;
  }

  @Selector()
  public static getPlaylists(state: ISoundcloudStateModel) {
    return state.playlists;
  }

  @Selector()
  public static allPlaylists(state: ISoundcloudStateModel) {
    return [...state.myPlaylists, ...state.playlists];
  }

  public static playlistById(id: number) {
    return createSelector(
      [this],
      (state: ISoundcloudStateModel) => state.myPlaylists.filter(playlist => playlist.id === id)[0],
    );
  }

  @Action(setSoundcloudState)
  public setSoundcloudState(
    ctx: StateContext<ISoundcloudStateModel>,
    { payload }: TSoundcloudPayload,
  ) {
    return ctx.patchState(payload);
  }
}
