import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMasteringOrderForm } from 'src/app/interfaces/forms/mastering-order-form.interface';

import { AppTranslateService } from '../../modules/translate/translate.service';
import { AppSendDemoService } from '../../services/send-demo/send-demo.service';
import { httpProgressActions } from '../../state/http-progress/http-progress.store';
import { WINDOW } from '../../utils/injection-tokens';

@Component({
  selector: 'app-demo',
  templateUrl: './demo-dialog.component.html',
  styleUrls: ['./demo-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDemoDialogComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    private readonly dialogRef: MatDialogRef<AppDemoDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly translateService: AppTranslateService,
    private readonly sendDemoService: AppSendDemoService,
    private readonly store: Store,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Email form.
   */
  public demoForm: IMasteringOrderForm = this.fb.group({
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
    if (this.demoForm.valid && !this.demoForm.pristine) {
      void this.sendDemo().subscribe();
    }
  }

  /**
   * Sends demo.
   */
  public sendDemo() {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    const formData: {
      email: string;
      link: string;
      domain: string;
    } = this.demoForm.value;
    return this.sendDemoService.sendDemo(formData).pipe(
      tap(
        data => {
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
          this.feedback.next(this.translateService.instant('demo.result.success'));
          const timeout = 15000;
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
