import { Component, OnInit, OnDestroy, ElementRef, Inject, HostBinding } from '@angular/core';
import { MatIconRegistry, DateAdapter } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './modules/translate/index';
import { CustomServiceWorkerService } from './services/custom-service-worker.service';

declare let $: JQueryStatic;

@Component({
	selector: 'app',
	templateUrl: '/app/views/app.html'
})
export class AppComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private matIconRegistry: MatIconRegistry,
		private dateAdapter: DateAdapter<any>,
		private domSanitizer: DomSanitizer,
		private emitter: EventEmitterService,
		private translate: TranslateService,
		private serviceWorker: CustomServiceWorkerService,
		@Inject('Window') private window: Window
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	private subscriptions: any[] = [];

	/**
	 * TODO action
	 */
	public activateSomething(): void {
		console.log('TODO activate something');
	}

	/**
	 * Indicates if progress spinner should be shown.
	 */
	public showSpinner: boolean = false;
	/**
	 * Shows spinner.
	 */
	private startSpinner(): void {
		this.showSpinner = true;
	}
	/**
	 * Hides spinner.
	 */
	private stopSpinner(): void {
		this.showSpinner = false;
	}

	public sidenavOpened: boolean = false;

	private supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];
	/**
	 * Checks if selected one is a current language.
	 */
	private isCurrentLanguage(key: string): boolean {
		return key === this.translate.currentLanguage;
	}
	/**
	 * Selects language.
	 */
	private selectLanguage(key: string): void {
		if (!this.isCurrentLanguage(key)) {
			this.translate.use(key); // set current language
			this.setDatepickersLocale(key); // set datepickers locale
		}
	}
	/**
	 * Sets datepickers locale.
	 * Supported languages: en, ru.
	 */
	private setDatepickersLocale(key: string): void {
		console.log('language change, key', key, 'this.dateAdapter', this.dateAdapter);
		if (key === 'ru') {
			this.dateAdapter.setLocale('ru');
		} else {
			this.dateAdapter.setLocale('en');
		}
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppComponent initialized');

		$('#init').remove(); // remove initialization text

		let sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppComponent, event:', event);
			if (event.spinner) {
				if (event.spinner === 'start') {
					console.log('AppComponent, starting spinner');
					this.startSpinner();
				} else if (event.spinner === 'stop') {
					console.log('AppComponent, stopping spinner');
					this.stopSpinner();
				}
			}
			if (event.lang) {
				console.log('AppComponent, switch language', event.lang);
				if (this.supportedLanguages.filter((item: any) => item.key === event.lang).length) {
					this.selectLanguage(event.lang); // switch language only if it is present in supportedLanguages array
				} else {
					console.log('AppComponent, selected language is not supported');
				}
			}
		});
		this.subscriptions.push(sub);

		sub = this.dateAdapter.localeChanges.subscribe(() => {
			console.log('dateAdapter.localeChanges, changed according to the language');
		});
		this.subscriptions.push(sub);

		/*
		* check preferred language, respect preference if dictionary exists
		*	for now there are only dictionaries only: English, Russian
		*	set Russian if it is preferred, else use English
		*/
		const nav: any = this.window.navigator;
		const userPreference: string = (nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru') ? 'ru' : 'en';
		this.selectLanguage(userPreference); // set default language

		/*
		*	register fontawesome for usage in mat-icon by adding directives
		*	fontSet="fab" fontIcon="fa-icon"
		*	fontSet="fas" fontIcon="fa-icon"
		*
		*	note: free plan includes only fab (font-awesome-brands) and fas (font-awesome-solid) groups
		*
		*	icons reference: https://fontawesome.com/icons/
		*/
		this.matIconRegistry.registerFontClassAlias('fontawesome-all');

		/*
		* add svgs
		*/
		this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl('/img/kosmos_circle.svg'));

	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.serviceWorker.disableServiceWorker();
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}

}
