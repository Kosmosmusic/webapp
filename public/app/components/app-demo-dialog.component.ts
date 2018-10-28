import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { SendDemoService } from '../services/send-demo.service';

import { TranslateService } from '../modules/translate/translate.service';

/**
 * Demo dialog.
 */
@Component({
	selector: 'app-demo',
	templateUrl: '/app/views/app-demo.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppDemoDialog implements OnInit, OnDestroy {

	/**
	 * @param data Dialog data provided by parent controller
	 * @param dialogRef Dialog reference
	 * @param fb Form builder - user input procession
	 * @param emitter Event emitter service - components interaction
	 * @param translateService Translate service - UI translation to predefined languages
	 */
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<AppDemoDialog>,
		private fb: FormBuilder,
		private emitter: EventEmitterService,
		private translateService: TranslateService,
		private sendDemoService: SendDemoService,
		@Inject('Window') private window: Window
	) {
		console.log('AppDemoDialog constructor', this.data);
	}

	private subscriptions: any[] = [];

	/**
	 * Email form.
	 */
	public demoForm: FormGroup;

	/**
	 * Resets email form group.
	 */
	private resetForm(): void {
		this.demoForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			link: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/\w+/)])],
			domain: [this.window.location.origin, Validators.compose([Validators.required, Validators.pattern(/.+/)])]
		});
	}

	/**
	 * Submits form.
	 */
	public submitForm(): void {
		if (this.demoForm.valid && !this.demoForm.pristine) {
			this.sendDemo()
				.catch((error: any) => {
					console.log('sendDemo, error', error);
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
	 * Sends demo.
	 */
	public sendDemo(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		this.emitter.emitProgressStartEvent();
		const formData: any = this.demoForm.value;
		this.sendDemoService.sendDemo(formData).subscribe(
			(data: any) => {
				console.log('sendDemo, data:', data);
				this.emitter.emitProgressStopEvent();
				def.resolve(true);
				this.feedback = this.translateService.instant('demo.result.success');
				setTimeout(() => {
					this.closeDialog();
				}, 1500);
			},
			(error: any) => {
				console.log('sendDemo, error', error);
				this.feedback = this.translateService.instant('demo.result.fail');
				this.emitter.emitProgressStopEvent();
				def.reject(false);
			},
			() => {
				console.log('sendDemo: done');
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
		console.log('ngOnInit: AppDemoDialog initialized');
		this.resetForm();

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppDemoDialog consuming event:', event);
			if (event.progress) {
				if (event.progress === 'start') {
					console.log('AppDemoDialog, starting progress');
					this.startProgress();
				} else if (event.progress === 'stop') {
					console.log('AppDemoDialog, stopping progress');
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
		console.log('ngOnDestroy: AppDemoDialog destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
