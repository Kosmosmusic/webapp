import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class SendBookingRequestService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('SendBookingRequestService constructor');
	}

	/**
	 * Send booking request endpoint.
	 */
	private endpoint: string = this.window.location.origin + '/sendBookingRequest';

	/**
	 * Sends booking request.
	 */
	public sendBookingRequest(formData: {
		date: string,
		venueName: string,
		venueCapacity: string,
		venueAddress: string,
		venueWebsite: string,
		eventName: string,
		eventWebsite: string,
		ticketCost: string,
		lineup: string,
		start: string,
		end: string,
		stageTime: string,
		fee: string,
		artistsBookedEarlier: string,
		company: string,
		contact: string,
		email: string,
		phone: string,
		website: string,
		domain: string
	}): Observable<any> {
		return this.http.post(this.endpoint, formData).pipe(
			timeout(this.handlers.timeoutValue()),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}
}
