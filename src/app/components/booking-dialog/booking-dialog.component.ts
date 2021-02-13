import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IBookingForm } from 'src/app/interfaces/forms/booking-form.interface';

import { AppTranslateService } from '../../modules/translate/translate.service';
import { AppSendBookingRequestService } from '../../services/send-booking-request/send-booking-request.service';
import { httpProgressActions } from '../../state/http-progress/http-progress.store';

@Component({
  selector: 'app-booking',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBookingDialogComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    private readonly dialogRef: MatDialogRef<AppBookingDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly translateService: AppTranslateService,
    private readonly sendBookingRequestService: AppSendBookingRequestService,
    private readonly store: Store,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Email form.
   */
  public bookingForm = this.fb.group({
    // event details
    date: ['', Validators.compose([Validators.required])],
    venueName: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    venueCapacity: ['', Validators.compose([Validators.required, Validators.min(1)])],
    venueAddress: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    venueWebsite: [
      '',
      Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/.+/)]),
    ],
    eventName: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    eventWebsite: [
      '',
      Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/.+/)]),
    ],
    ticketCost: ['', Validators.compose([Validators.required, Validators.min(0)])],
    lineup: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    start: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-:]+/)])],
    end: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-:]+/)])],
    stageTime: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-,:]+/)])],
    fee: ['', Validators.compose([Validators.required, Validators.min(1)])],
    artistsBookedEarlier: [''],

    // promoter details
    company: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    contact: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    phone: ['', Validators.compose([Validators.required, Validators.pattern(/\+\d\s[\d\s-]+/)])],
    website: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/.+/)])],
    domain: [this.window.location.origin, Validators.compose([Validators.required])],
  }) as IBookingForm;

  private readonly feedback = new BehaviorSubject<string | undefined>(void 0);

  public readonly feedback$ = this.feedback.asObservable();

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.bookingForm.valid && !this.bookingForm.pristine) {
      void this.sendBookingRequest().subscribe();
    }
  }

  /**
   * Sends email.
   */
  public sendBookingRequest() {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    const formData: {
      date: string;
      venueName: string;
      venueCapacity: string;
      venueAddress: string;
      venueWebsite: string;
      eventName: string;
      eventWebsite: string;
      ticketCost: string;
      lineup: string;
      start: string;
      end: string;
      stageTime: string;
      fee: string;
      artistsBookedEarlier: string;
      company: string;
      contact: string;
      email: string;
      phone: string;
      website: string;
      domain: string;
    } = this.bookingForm.value;
    return this.sendBookingRequestService.sendBookingRequest(formData).pipe(
      tap(
        data => {
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));

          this.feedback.next(this.translateService.instant('booking.result.success'));
          const timeout = 1500;
          setTimeout(() => {
            this.closeDialog();
          }, timeout);
        },
        error => {
          this.feedback.next(this.translateService.instant('booking.result.fail'));
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
        },
      ),
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
