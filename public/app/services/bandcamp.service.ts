import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

/**
 * TODO:client should form widget urls for bandcamp albums.
 * Albums should be fetched on server, and stored in db.
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
}
