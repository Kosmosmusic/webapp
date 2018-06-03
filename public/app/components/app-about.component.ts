import { Component, OnInit, OnDestroy } from '@angular/core';

import { FirebaseService } from '../services/firebase.service';

@Component({
	selector: 'app-about',
	templateUrl: '/app/views/app-about.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppAboutComponent implements OnInit, OnDestroy {

	constructor(
		private firebaseService: FirebaseService
	) {}

	public details: any = {};

	private getDetails(): void {
		this.firebaseService.getDB('about', false)
			.then((snapshot) => {
				console.log('getDetails, about', snapshot.val());
				const response = snapshot.val();
				this.details = {};
				const keys = Object.keys(response);
				keys.forEach((key) => {
					this.details[key] = response[key];
				});
			})
			.catch((error) => {
				console.log('getDetails, error', error);
			});
	}

	public showContactDialog(): void {
		/*
		$mdDialog.show({
			controller: 'contactController',
			templateUrl: './app/views/contact.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true
		}).then(
			(result) => console.log('submitted', result),
			(rejected) => console.log('closed', rejected)
		);
		*/
		console.log('TODO show contact dialog');
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppAboutComponent initialized');
		this.getDetails();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppAboutComponent destroyed');
		this.firebaseService.getDB('about', true).off();
	}
}
