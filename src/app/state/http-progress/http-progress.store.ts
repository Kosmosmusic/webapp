import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { startProgress, stopProgress } from './http-progress.actions';
import { IHttpProgressStateModel, THttpProgressPayload } from './http-progress.interface';

export const httpProgressActions = {
  startProgress,
  stopProgress,
};

export const HTTP_PROGRESS_STATE_TOKEN = new StateToken<IHttpProgressStateModel>('httpProgress');

@State<IHttpProgressStateModel>({
  name: HTTP_PROGRESS_STATE_TOKEN,
  defaults: {
    mainView: false,
  },
})
@Injectable()
export class AppHttpProgressState {
  @Selector()
  public static getState(state: IHttpProgressStateModel) {
    return state;
  }

  @Selector()
  public static mainViewProgress(state: IHttpProgressStateModel) {
    return state.mainView;
  }

  @Action(startProgress)
  public startProgress(
    ctx: StateContext<IHttpProgressStateModel>,
    { payload }: THttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }

  @Action(stopProgress)
  public stopProgress(
    ctx: StateContext<IHttpProgressStateModel>,
    { payload }: THttpProgressPayload,
  ) {
    return ctx.patchState(payload);
  }
}
