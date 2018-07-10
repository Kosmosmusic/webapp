import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class SendDemoService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {
		console.log('SendDemoService constructor');
	}

	/**
	 * Send demo endpoint.
	 */
	private endpoint: string = this.window.location.origin + '/sendDemo';

	/**
	 * Sends demo.
	 */
	public sendDemo(formData: { email: string, link: string, domain: string }): Observable<any[]> {
		return this.http.post(this.endpoint, formData).pipe(
			timeout(this.handlers.timeoutValue()),
			take(1),
			map(this.handlers.extractObject),
			catchError(this.handlers.handleError)
		);
	}
}