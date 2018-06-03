import { Injectable, Inject } from '@angular/core';

import { Observable, Observer, of } from 'rxjs';
import { map } from 'rxjs/operators';

declare let firebase;

@Injectable()
export class FirebaseService {

	constructor(
		@Inject('Window') private window: Window
	) {
		console.log('FirebaseService constructor');
		this.init();
	}

	private config: any = {
		apiKey: 'firebase_api_key',
		authDomain: 'firebase_auth_domain',
		databaseURL: 'firebase_database_url',
		projectId: 'firebase_project_id',
		storageBucket: 'firebase_storage_bucket',
		messagingSenderId: 'firebase_messaging_sender_id'
	};

	private db: any;

	private init(): void {
		firebase.initializeApp(this.config);
		this.db = firebase.database();
	}

	public getDB(collection: 'about'|'contacts', refOnly: boolean): any {
		if (collection && (/(about|contacts)/.test(collection))) {
			return (!refOnly) ? this.db.ref('/' + collection).once('value') : this.db.ref('/' + collection);
		} else {
			throw new TypeError('firebaseService, getDB(collection): missing collection identifier, which can have values: about, freedownloads, blog, blogEntriesIDs, brands, users, emails');
		}
	}
}
