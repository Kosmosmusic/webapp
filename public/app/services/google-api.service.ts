import { Injectable, Inject } from '@angular/core';

import { Observable, Observer, of } from 'rxjs';
import { map } from 'rxjs/operators';

import ClientConfig = gapi.auth2.ClientConfig;
interface INgGapiClientConfig extends ClientConfig {
	discoveryDocs: string[];
}

import GoogleAuth = gapi.auth2.GoogleAuth;

@Injectable()
export class GoogleApiService {

	constructor(
		@Inject('Window') private window: Window
	) {
		console.log('GoogleApiService constructor');
		this.getAuth().subscribe((auth: any) => {
			console.log('auth', auth);
			auth.subscribe((authObj: GoogleAuth) => {
				console.log('is signed in', auth.isSignedIn.get());
			});
		});
	}

	/*
	*	API
	*/

	private readonly gapiUrl: string = 'https://apis.google.com/js/api.js';

	private loadGapi(): Observable<void> {
		return Observable.create((observer: Observer<boolean>) => {
			const node = this.window.document.createElement('script');
			node.src = this.gapiUrl;
			node.type = 'text/javascript';
			node.charset = 'utf-8';
			this.window.document.getElementsByTagName('head')[0].appendChild(node);
			node.onload = () => {
				console.log('gapi service loaded');
				observer.next(true);
				observer.complete();
			};
		});
	}

	public onLoad(): Observable<void> {
		return this.loadGapi();
	}

	/*
	* Auth
	*/

	private clientConfig: INgGapiClientConfig = {
		client_id: 'google_apis_client_id',
		discoveryDocs: ['https://www.googleapis.com/youtube/v3'],
		scope: ['https://www.googleapis.com/auth/youtube.readonly'].join(' ')
	};
	private googleAuth: GoogleAuth = undefined;
	private loadGapiAuth(): Observable<GoogleAuth> {
		return Observable.create((observer: Observer<GoogleAuth>) => {
			gapi.load('auth2', () => {
				gapi.auth2.init(this.clientConfig).then((auth: GoogleAuth) => {
					this.googleAuth = auth;
					console.log('this.googleAuth', this.googleAuth);
					observer.next(auth);
					observer.complete();
				});
			});
		});
	}
	public getAuth(): Observable<GoogleAuth> {
		if (!this.googleAuth) {
			return this.onLoad().pipe(
				map(() => this.loadGapiAuth())
			);
		}
		return Observable.of(this.googleAuth);
	}

	/*
	* Youtube
	*/

	private part: string = 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails';
	private channelId: string = 'UC2HOUBVyZw9mPM3joMShYKQ';
	private gcbk: string = 'google_apis_browser_key';
	private gcid: string = 'google_apis_client_id';
	private gscope: string = 'https://www.googleapis.com/auth/youtube.readonly';

	/*
	* TODO: get channel details, return to component required data for youtube playlist init
	*/
/*
	channel: () => GApi.execute('youtube', 'channels.list', {
		part: part,
		id: channelId,
		key: gcbk
	})
*/
}
