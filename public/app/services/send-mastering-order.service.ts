import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class SendMasteringOrderService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('SendMasteringOrderService constructor');
	}

	/**
	 * Send mastering order endpoint.
	 */
	private endpoint: string = this.window.location.origin + '/sendMasteringOrder';

	/**
	 * Sends mastering order.
	 */
	public sendOrder(formData: { email: string, link: string, domain: string }): Observable<any> {
		return this.http.post(this.endpoint, formData).pipe(
			timeout(this.handlers.timeoutValue()),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}
}
