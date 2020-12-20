import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Booking form interface.
 */
export interface IBookingForm extends FormGroup {
  controls: {
    date: AbstractControl;
    venueName: AbstractControl;
    venueCapacity: AbstractControl;
    venueAddress: AbstractControl;
    venueWebsite: AbstractControl;
    eventName: AbstractControl;
    eventWebsite: AbstractControl;
    ticketCost: AbstractControl;
    lineup: AbstractControl;
    start: AbstractControl;
    end: AbstractControl;
    stageTime: AbstractControl;
    fee: AbstractControl;
    artistsBookedEarlier: AbstractControl;
    company: AbstractControl;
    contact: AbstractControl;
    email: AbstractControl;
    phone: AbstractControl;
    website: AbstractControl;
    domain: AbstractControl;
  };
}
