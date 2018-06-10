import { Injectable } from '@angular/core';

/**
 * Generates urls for bandcamp widgets.
 */
@Injectable()
export class BandcampService {

	constructor() {
		console.log('BandcampService constructor');
	}

	/**
	 * Bandcamp widget url parts.
	 */
	private urls: any = {
		iframe: {
			first: 'https://bandcamp.com/EmbeddedPlayer/album=',
			last: '/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/'
		},
		a: 'https://kosmosmusicru.bandcamp.com/album/'
	};

	/**
	 * Get iframe url.
	 */
	public getIframeUrl(bandcampAlbumId: string): string {
		return this.urls.iframe.first + bandcampAlbumId + this.urls.iframe.last;
	}

	/**
	 * Get anchor url.
	 */
	public getAnchorUrl(albumReleaseCode: string): string {
		return this.urls.a + albumReleaseCode;
	}
}
