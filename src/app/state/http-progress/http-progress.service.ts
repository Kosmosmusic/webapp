import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Provider } from '@angular/core';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { AppProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import {
  IHttpProgressHandlers,
  IHttpProgressService,
  IHttpProgressStateModel,
} from './http-progress.interface';
import { AppHttpProgressState, httpProgressActions } from './http-progress.store';

@Injectable({
  providedIn: 'root',
})
export class AppHttpProgressService implements IHttpProgressService {
  public readonly mainView$ = this.store.select(AppHttpProgressState.mainViewProgress);

  public readonly handlers: IHttpProgressHandlers = {
    mainView: {
      start: () => this.startProgress(this.newHttpProgressState(true)),
      stop: () => this.stopProgress(this.newHttpProgressState(false)),
      tapStopperObservable: <Any>() => {
        return tap<Any>(
          () => {
            this.handlers.mainView.stop();
          },
          () => {
            this.handlers.mainView.stop();
          },
        );
      },
    },
  };

  constructor(private readonly store: Store, private readonly progressRef: OverlayRef) {}

  private newHttpProgressState(mainView?: boolean): Partial<IHttpProgressStateModel> {
    const payload: Partial<IHttpProgressStateModel> =
      typeof mainView === 'boolean' ? { mainView } : {};
    return payload;
  }

  private attachIndicator(): void {
    const portal = new ComponentPortal<AppProgressBarComponent>(AppProgressBarComponent);
    if (!this.progressRef.hasAttached()) {
      this.progressRef.attach(portal);
    }
  }

  private detachIndicator(): void {
    if (this.progressRef.hasAttached()) {
      this.progressRef.detach();
    }
  }

  private startProgress(payload: Partial<IHttpProgressStateModel>) {
    if (typeof payload.mainView !== 'undefined') {
      this.attachIndicator();
    }
    return this.store.dispatch(new httpProgressActions.startProgress(payload));
  }

  private stopProgress(payload: Partial<IHttpProgressStateModel>) {
    if (typeof payload.mainView !== 'undefined') {
      this.detachIndicator();
    }
    return this.store.dispatch(new httpProgressActions.stopProgress(payload));
  }
}

/**
 * Http progress service factory constructor.
 */
export type THttpProgressServiceFactoryConstructor = (
  store: Store,
  overlay: Overlay,
) => AppHttpProgressService;

/**
 * Http progress service factory.
 */
export const httpProgressServiceFactory: THttpProgressServiceFactoryConstructor = (
  store: Store,
  overlay: Overlay,
) => {
  const progressRef: OverlayRef = overlay.create({
    hasBackdrop: true,
    positionStrategy: overlay.position().global().top().width('100%').centerHorizontally(),
  });
  return new AppHttpProgressService(store, progressRef);
};

/**
 * Http progress service provider.
 */
export const httpProgressServiceProvider: Provider = {
  provide: AppHttpProgressService,
  useFactory: httpProgressServiceFactory,
  deps: [Store, Overlay],
};
