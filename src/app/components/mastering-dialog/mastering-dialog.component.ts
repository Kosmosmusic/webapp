import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IMasteringOrderForm } from '../../interfaces/forms/mastering-order-form.interface';
import { AppTranslateService } from '../../modules/translate/translate.service';
import { AppSendMasteringOrderService } from '../../services/send-mastering-order/send-mastering-order.service';
import { httpProgressActions } from '../../state/http-progress/http-progress.store';
import { WINDOW } from '../../utils/injection-tokens';

@Component({
  selector: 'app-mastering-dialog',
  templateUrl: './mastering-dialog.component.html',
  styleUrls: ['./mastering-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMasteringDialogComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    private readonly dialogRef: MatDialogRef<AppMasteringDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly translateService: AppTranslateService,
    private readonly sendMasteringOrderService: AppSendMasteringOrderService,
    private readonly store: Store,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Email form.
   */
  public orderForm: IMasteringOrderForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    link: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/\w+/)])],
    domain: [
      this.window.location.origin,
      Validators.compose([Validators.required, Validators.pattern(/.+/)]),
    ],
  }) as IMasteringOrderForm;

  private readonly feedback = new BehaviorSubject<string | undefined>(void 0);

  public readonly feedback$ = this.feedback.asObservable();

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.orderForm.valid && !this.orderForm.pristine) {
      void this.sendOrder().subscribe();
    }
  }

  /**
   * Sends demo.
   */
  public sendOrder() {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    const formData: {
      email: string;
      link: string;
      domain: string;
    } = this.orderForm.value;
    return this.sendMasteringOrderService.sendOrder(formData).pipe(
      tap(
        data => {
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));

          this.feedback.next(this.translateService.instant('demo.result.success'));
          const timeout = 1500;
          setTimeout(() => {
            this.closeDialog();
          }, timeout);
        },
        error => {
          this.feedback.next(this.translateService.instant('demo.result.fail'));
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
        },
      ),
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
