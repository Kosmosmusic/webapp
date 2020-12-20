import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Mastering prder form interface.
 */
export interface IMasteringOrderForm extends FormGroup {
  controls: {
    email: AbstractControl;
    link: AbstractControl;
    domain: AbstractControl;
  };
}
