import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { IEmailSubscriptionForm } from '../../interfaces/forms/email-subscription-form.interface';
import { AppTranslateService } from '../../modules/translate/translate.service';
import { AppEmailSubscriptionService } from '../../services/email-subscription/email-subscription.service';
import { AppFirebaseService } from '../../services/firebase/firebase.service';
import { httpProgressActions } from '../../state/http-progress/http-progress.store';
import { WINDOW } from '../../utils/injection-tokens';
import { AppContactDialogComponent } from '../contact-dialog/contact-dialog.component';

interface IAboutData {
  links?: {
    soundcloud: string;
    rss: string;
    mixcloud: string;
    twitter: string;
    facebook: string;
    youtube: string;
    instagram: string;
    bandcamp: string;
    vkontakte: string;
    telegram: string;
  };
  soundcloudUserId?: number;
  text?: string;
  title?: string;
  widgetLink?: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppAboutComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly translateService: AppTranslateService,
    private readonly firebaseService: AppFirebaseService,
    private readonly emailSubscriptionService: AppEmailSubscriptionService,
    private readonly store: Store,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  public readonly details$ = this.firebaseService
    .getListItem<IAboutData>('about')
    .valueChanges()
    .pipe(filter(data => data !== null));

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance?: MatDialogRef<AppContactDialogComponent>;

  /**
   * Subscription form.
   */
  public subscriptionForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    domain: [
      this.window.location.origin,
      Validators.compose([Validators.required, Validators.pattern(/.+/)]),
    ],
    // eslint-disable-next-line @typescript-eslint/naming-convention -- TODO: pass the value without disabling naming convention filewide
    b_3eeba7cfe8388b91c662bdf95_8cca3229c8: [''],
  }) as IEmailSubscriptionForm;

  /**
   * UI feedback for user actions.
   */
  private readonly feedback = new BehaviorSubject<string | undefined>(void 0);

  public readonly feedback$ = this.feedback.asObservable();

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialogInstance = this.dialog.open(AppContactDialogComponent, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {},
    });
    void this.dialogInstance
      .afterClosed()
      .pipe(
        tap(() => {
          this.dialogInstance = void 0;
        }),
      )
      .subscribe();
  }

  /**
   * Subscribes user to mailing list.
   */
  public subscribeToMailingList() {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    const formData: {
      email: string;
      domain: string;
      // eslint-disable-next-line @typescript-eslint/naming-convention -- TODO: pass the value without disabling naming convention filewide
      b_3eeba7cfe8388b91c662bdf95_8cca3229c8: '';
    } = this.subscriptionForm.value;
    void this.emailSubscriptionService
      .subscribe(formData)
      .pipe(
        tap(
          () => {
            void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
            this.feedback.next(this.translateService.instant('subscribe.result.success'));
          },
          error => {
            void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
            this.feedback.next(
              `${this.translateService.instant('subscribe.result.fail')}: ${error}`,
            );
            const timeout = 3000;
            setTimeout(() => {
              this.feedback.next(void 0);
            }, timeout);
          },
        ),
      )
      .subscribe();
  }
}
