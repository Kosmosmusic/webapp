import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * Makes a request to bandcamp by artist page url.
 * Parses html-response, and retrieves album urls.
 */
@Injectable()
export class BandcampService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService
	) {
		console.log('BandcampService constructor');
	}

	/**
	 * Bandcamp page url.
	 */
	private url: string = 'https://kosmosmusicru.bandcamp.com/';

	private parseHtml(res: string): string[] {
		console.log('parseHtml, res', res);
		return [];
	}

	/**
	 * Makes a bandcamp request, returns album urls as an array.
	 */
	public getAlbumUrls(): Observable<any> {
		return this.http.get(this.url, { responseType: 'text' }).pipe(
			timeout(this.handlers.timeoutValue()),
			take(1),
			map(this.parseHtml),
			catchError(this.handlers.handleError)
		);
	}
}
