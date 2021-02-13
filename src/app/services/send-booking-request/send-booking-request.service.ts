import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { AppHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class AppSendBookingRequestService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: AppHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Send booking request endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/sendBookingRequest';

  /**
   * Sends booking request.
   */
  public sendBookingRequest(formData: {
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
  }) {
    return this.http
      .post(this.endpoint, formData)
      .pipe(timeout(this.handlers.defaultHttpTimeout), catchError(this.handlers.handleError));
  }
}
