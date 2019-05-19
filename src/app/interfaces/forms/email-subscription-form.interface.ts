import { FormGroup, AbstractControl } from '@angular/forms';

/**
 * Email subscription interface.
 */
export interface IEmailSubscriptionForm extends FormGroup {
  controls: {
    email: AbstractControl;
    domain: AbstractControl;
    b_3eeba7cfe8388b91c662bdf95_8cca3229c8: AbstractControl;
  };
}
