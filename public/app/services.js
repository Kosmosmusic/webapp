'use strict';
/* global kosmosmusicServices */

kosmosmusicServices.factory('regXpatternsService', [ function() {
	/*
	*	regular expression patterns shared service
	*/
	return {
		email: /\w{2}@\w{2,}(\.)?\w{2,}/,
		soundcloudPlaylistLink: /^https:\/\/soundcloud\.com\/\w+[^/]*\/sets\/\w+[^/]*$/,
		links: {
			bandcamp: /^https:\/\/\w+\.bandcamp\.com(\/)?$/,
			facebook: /^https:\/\/www\.facebook\.com\/[^/\s]+(\/)?$/,
			instagram: /^https:\/\/www\.instagram\.com\/[^/\s]+(\/)?$/,
			soundcloud: /^https:\/\/www\.soundcloud\.com\/[^/\s]+(\/)?$/,
			twitter: /^https:\/\/twitter\.com\/[^/\s]+(\/)?$/,
			website: /^http(s)?:\/\/(www\.)?[^/\s]+\.[a-z]{2,}(\/)?$/,
			youtube: /^https:\/\/www\.youtube\.com\/(c|user)\/[^/\s]+(\/)?$/
		},
		text: /\w{3,}/,
		name: /\w{2,}/,
		header: /\w{5,}/,
		message: /[\w\s_-]{75,}/,
		password: /\w{8,}/
	};
}]);

/*
*	dynamically set backend base url to be able to deploy on any domain
*/
function setBaseUrl(absUrl) {
	return absUrl.match(new RegExp('http(s)?://[^/]+'))[0];
}

kosmosmusicServices.factory('sendEmailService', ['$resource', '$location', function($resource, $location) {
	const baseUrl = setBaseUrl($location.$$absUrl);
	return $resource( baseUrl + '/sendEmail', {}, {
		save: {method: 'POST', params: {}, headers: {'Content-type': 'application/x-www-form-urlencoded'}, isArray: false,
			interceptor: {
				response: (response) => {
					response.resource.$httpHeaders = response.headers;
					return response.resource;
				}
			}
		}
	});
}]);

/*
*	TODO: sendDemoOverEmailService factory
*/

kosmosmusicServices.service('soundcloudService', [function() {
	const scid = 'soundcloud_client_id';
	const options = {
		client_id: scid,
		redirect_uri: 'http://dnbhub.com/callback.html' // TODO: replace callback url after API key issue
	};
	const service = {
		/* global SC */
		init: () => {
			return SC.initialize(options);
		},
		getLinkWithId: (href) => href + '?client_id=' + scid
	};
	return service;
}]);

kosmosmusicServices.service('googleService', ['GApi', 'GAuth', 'GData', function(GApi, GAuth, GData) {
	/*
	*	library description reference https://github.com/maximepvrt/angular-google-gapi/
	*/
	const part = 'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails';
	const channelId = 'UC2HOUBVyZw9mPM3joMShYKQ';
	const gcbk = 'google_apis_browser_key';
	const gcid = 'google_apis_client_id';
	const gScope = 'https://www.googleapis.com/auth/youtube.readonly';
	const service = {
		init: () => {
			GApi.load('youtube', 'v3').catch((api, version) => console.log('GApi init error:', api, 'version', version));
			GAuth.setClient(gcid);
			GAuth.setScope(gScope);
			GAuth.load();
		},
		gData: () => GData,
		channel: () => GApi.execute('youtube', 'channels.list', {
			part: part,
			id: channelId,
			key: gcbk
		})
	};
	return service;
}]);

kosmosmusicServices.service('firebaseService', [function() {
	const service = {
		/* global firebase */
		initFirebase: () => {
			const config = {
				apiKey: 'firebase_api_key',
				authDomain: 'firebase_auth_domain',
				databaseURL: 'firebase_database_url',
				projectId: 'firebase_project_id',
				storageBucket: 'firebase_storage_bucket',
				messagingSenderId: 'firebase_messaging_sender_id'
			};
			firebase.initializeApp(config);
			service.db = firebase.database();
		},

		db: undefined,

		getDB: (collection, refOnly) => {
			if (collection && (/(about|contacts)/.test(collection))) {
				return (!refOnly) ? service.db.ref('/' + collection).once('value') : service.db.ref('/' + collection);
			} else {
				throw new TypeError('firebaseService, getDB(collection): missing collection identifier, which can have values: about, freedownloads, blog, blogEntriesIDs, brands, users, emails');
			}
		}
	};

	return service;

}]);
