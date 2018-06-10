import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { FirebaseService } from '../services/firebase.service';

import { AppContactDialog } from './app-contact.component';

@Component({
	selector: 'app-about',
	templateUrl: '/app/views/app-about.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppAboutComponent implements OnInit, OnDestroy {

	/**
	 * @param dialog Reusable dialog
	 * @param firebaseService Firebase interaction service
	 */
	constructor(
		private dialog: MatDialog,
		private fb: FormBuilder,
		private emitter: EventEmitterService,
		private firebaseService: FirebaseService
	) {
		this.resetEmailSignupForm();
	}

	/**
	 * Company details object.
	 */
	public details: { links?: object, soundcloudUserId?: number, text?: string, title?: string, widgetLink?: string } = {};

	/**
	 * Gets company details from firebase.
	 */
	private getDetails(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.emitter.emitSpinnerStartEvent();
		this.firebaseService.getDB('about', false)
			.then((snapshot) => {
				console.log('getDetails, about', snapshot.val());
				const response = snapshot.val();
				this.details = {};
				const keys = Object.keys(response);
				keys.forEach((key) => {
					this.details[key] = response[key];
				});
				this.emitter.emitSpinnerStopEvent();
				def.resolve();
			})
			.catch((error) => {
				console.log('getDetails, error', error);
				this.emitter.emitSpinnerStopEvent();
				def.reject();
			});
		return def.promise;
	}

	/**
	 * Reusable modal dialogs instance.
	 */
	private dialogInstance: any;

	/**
	 * Shows contact dialog.
	 */
	public showContactDialog(): void {
		this.dialogInstance = this.dialog.open(AppContactDialog, {
			height: '85vh',
			width: '95vw',
			maxWidth: '1680',
			maxHeight: '1024',
			autoFocus: true,
			disableClose: false,
			data: {}
		});
		this.dialogInstance.afterClosed().subscribe((result: any) => {
			console.log('cargo order details modal closed with result', result);
			this.dialogInstance = undefined;
		});
	}

	/**
	 * Subscription form.
	 */
	public subscriptionForm: FormGroup;

	/**
	 * Resets email signup form.
	 */
	private resetEmailSignupForm(): void {
		this.subscriptionForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			b_3eeba7cfe8388b91c662bdf95_8cca3229c8: ['']
		});
	}

	/**
	 * Submit subscriptionForm.
	 * Returns url if control value is empty.
	 */
	public subscriptionUrl(): string {
		const url = 'https://dnbhub.us3.list-manage.com/subscribe/post?u=3eeba7cfe8388b91c662bdf95&id=8cca3229c8&subscribe=Subscribe&EMAIL=' + this.subscriptionForm.controls.email.value + '&b_3eeba7cfe8388b91c662bdf95_8cca3229c8=' + this.subscriptionForm.controls.b_3eeba7cfe8388b91c662bdf95_8cca3229c8.value;
		return !this.subscriptionForm.controls.b_3eeba7cfe8388b91c662bdf95_8cca3229c8.value ? url : '';
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppAboutComponent initialized');
		this.getDetails();
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppAboutComponent destroyed');
		this.firebaseService.getDB('about', true).off();
	}
}
