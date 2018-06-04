import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

declare let SC;

@Injectable()
export class SoundcloudService {

	constructor(
		private http: HttpClient,
		private handlers: CustomHttpHandlersService
	) {
		console.log('SoundcloudService constructor');

	}

	/**
	 * Soundcloud client id.
	 */
	private options: { client_id, redirect_uri } = {
		client_id: 'soundcloud_client_id',
		redirect_uri: 'http://dnbhub.com/callback.html' // TODO: replace callback url after API key issue
	};

	/**
	 * Soundcloud initialization.
	 */
	private init(): void {
		return SC.initialize(this.options);
	}

	/**
	 * Returns link with id.
	 */
	public getLinkWithId(href: string): string {
		return `${href}?client_id=${this.options.client_id}`;
	}
}
