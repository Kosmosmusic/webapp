import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IEmailForm } from '../../interfaces/forms/email-form.interface';
import { AppTranslateService } from '../../modules/translate/translate.service';
import { AppSendEmailService } from '../../services/send-email/send-email.service';
import { AppSpinnerService } from '../../services/spinner/spinner.service';

/**
 * Contact dialog.
 */
@Component({
  selector: 'app-contact',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContactDialogComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    private readonly dialogRef: MatDialogRef<AppContactDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly translateService: AppTranslateService,
    private readonly sendEmailService: AppSendEmailService,
    private readonly spinner: AppSpinnerService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Email form.
   */
  public emailForm: IEmailForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    name: ['', Validators.compose([Validators.required, Validators.pattern(/\w{2,}/)])],
    header: ['', Validators.compose([Validators.required, Validators.pattern(/\w{4,}/)])],
    message: ['', Validators.compose([Validators.required, Validators.pattern(/[\w\s_-]{50,}/)])],
    domain: [
      this.window.location.origin,
      Validators.compose([Validators.required, Validators.pattern(/.+/)]),
    ],
  }) as IEmailForm;

  private readonly feedback = new BehaviorSubject<string | undefined>(void 0);

  public readonly feedback$ = this.feedback.asObservable();

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.emailForm.valid && !this.emailForm.pristine) {
      void this.sendEmail().subscribe();
    }
  }

  /**
   * Sends email.
   */
  public sendEmail() {
    this.spinner.startSpinner();
    const formData: {
      name: string;
      email: string;
      header: string;
      message: string;
      domain: string;
    } = this.emailForm.value;
    return this.sendEmailService.sendEmail(formData).pipe(
      tap(
        data => {
          this.spinner.stopSpinner();
          this.feedback.next(this.translateService.instant('contact.result.success'));
          const timeout = 1500;
          setTimeout(() => {
            this.closeDialog();
          }, timeout);
        },
        error => {
          this.feedback.next(this.translateService.instant('contact.result.fail'));
          this.spinner.stopSpinner();
        },
      ),
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
