import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { SendBookingRequestService } from '../services/send-booking-request.service';
import { EmailSubscriptionService } from '../services/email-subscription.service';

import { TranslateService } from '../modules/translate/translate.service';

/**
 * Booking dialog.
 */
@Component({
	selector: 'app-booking',
	templateUrl: '/app/views/app-booking.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppBookingDialog implements OnInit, OnDestroy {

	/**
	 * @param data Dialog data provided by parent controller
	 * @param dialogRef Dialog reference
	 * @param fb Form builder - user input procession
	 * @param emitter Event emitter service
	 * @param translateService Translate service - UI translation to predefined languages
	 * @param sendBookingRequestService Send booking request service - sends a booking request to specified email address by calling cloud functions
	 * @param window Window reference
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<AppBookingDialog>,
		private fb: FormBuilder,
		private emitter: EventEmitterService,
		private translateService: TranslateService,
		private sendBookingRequestService: SendBookingRequestService,
		@Inject('Window') private window: Window
	) {
		console.log('AppBookingDialog constructor', this.data);
	}

	private subscriptions: any[] = [];

	/**
	 * Email form.
	 */
	public bookingForm: FormGroup;

	/**
	 * Resets email form group.
	 */
	private resetEmailForm(): void {
		this.bookingForm = this.fb.group({
			// event details
			date: ['', Validators.compose([Validators.required])],
			venueName: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			venueCapacity: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			venueAddress: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			venueWebsite: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			eventName: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			eventWebsite: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
			ticketCost: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
			lineup: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
			start: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-\:]+/)])],
			end: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-\:]+/)])],
			stageTime: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-,\:]+/)])],
			fee: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
			artistsBookedEarlier: ['', Validators.compose([Validators.required, Validators.minLength(5)])],

			// promoter details
			company: ['', Validators.compose([Validators.required, Validators.pattern(/\w{2,}/)])],
			contact: ['', Validators.compose([Validators.required, Validators.pattern(/\w{2,}/)])],
			email: ['', Validators.compose([Validators.required, Validators.email])],
			phone: [''],
			website: [''],
			domain: [this.window.location.origin, Validators.compose([Validators.required, Validators.pattern(/.+/)])]
		});
	}

	/**
	 * Submits form.
	 */
	public submitForm(): void {
		if (this.bookingForm.valid && !this.bookingForm.pristine) {
			this.sendBookingRequest()
				.catch((error: any) => {
					console.log('sendBookingRequest, error', error);
				});
		}
	}

	/**
	 * UI feedback for user actions.
	 */
	public feedback: string;

	/**
	 * Dialog loading state.
	 */
	private loading: boolean = false;
	/**
	 * Use in templates to get loaded state.
	 */
	public loaded(): boolean {
		return !this.loading;
	}

	/**
	 * Starts progress.
	 */
	private startProgress(): void {
		this.loading = true;
	}
	/**
	 * Stops progress.
	 */
	private stopProgress(): void {
		this.loading = false;
	}

	/**
	 * Sends email.
	 */
	public sendBookingRequest(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		this.emitter.emitProgressStartEvent();
		const formData: any = this.bookingForm.value;
		console.log('formData', formData);
		this.sendBookingRequestService.sendBookingRequest(formData).subscribe(
			(data: any) => {
				console.log('sendBookingRequest, data:', data);
				this.emitter.emitProgressStopEvent();
				def.resolve(true);
				this.feedback = this.translateService.instant('booing.result.success');
				setTimeout(() => {
					this.closeDialog();
				}, 1500);
			},
			(error: any) => {
				console.log('sendBookingRequest, error', error);
				this.feedback = this.translateService.instant('booing.result.fail');
				this.emitter.emitProgressStopEvent();
				def.reject(false);
			},
			() => {
				console.log('sendBookingRequest: done');
			}
		);
		return def.promise;
	}

	/**
	 * Closes dialog.
	 * @param [result] result returned to parent component
	 */
	private closeDialog(result?: any) {
		/*
		*	report result if it was commonly closed, or modified and closed, deleted,
		*	or optional use result is provided
		*	parent controller should listen to this event
		*/
		result = (result) ? result : 'closed';
		this.dialogRef.close(result);
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppBookingDialog initialized');
		this.resetEmailForm();

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppBookingDialog consuming event:', event);
			if (event.progress) {
				if (event.progress === 'start') {
					console.log('AppBookingDialog, starting progress');
					this.startProgress();
				} else if (event.progress === 'stop') {
					console.log('AppBookingDialog, stopping progress');
					this.stopProgress();
				}
			}
		});
		this.subscriptions.push(sub);
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppBookingDialog destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
