import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule} from '@angular/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './modules/custom-material.module';

import { AppComponent } from './app.component';
import { AppNavComponent } from './components/app-nav.component';
import { AppIndexComponent } from './components/app-index.component';
import { AppMasteringComponent } from './components/app-mastering.component';
import { AppMixesComponent } from './components/app-mixes.component';
import { AppVideosComponent } from './components/app-videos.component';
import { AppAboutComponent } from './components/app-about.component';
import { AppContactDialog } from './components/app-contact.component';
import { AppDemoDialog } from './components/app-demo.component';
import { AppBookingDialog } from './components/app-booking.component';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './modules/translate/index';

import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';
import { EventEmitterService } from './services/event-emitter.service';

import { GoogleApiService } from './services/google-api.service';
import { FirebaseService } from './services/firebase.service';
import { SendEmailService } from './services/send-email.service';
import { SendDemoService } from './services/send-demo.service';
import { SendBookingRequestService } from './services/send-booking-request.service';
import { EmailSubscriptionService } from './services/email-subscription.service';
import { SoundcloudService } from './services/soundcloud.service';
import { BandcampService } from './services/bandcamp.service';
import { FacebookService } from './services/facebook.service';

import { IframeContentLoadedDirective } from './directives/iframe-content-loaded.directive';
import { BandcampWidgetSrcDirective } from './directives/bandcamp-widget-src.directive';

@NgModule({
	declarations: [ AppComponent, TranslatePipe, AppNavComponent, AppIndexComponent, AppMasteringComponent,
									AppMixesComponent, AppVideosComponent, AppAboutComponent, AppContactDialog, AppDemoDialog,
									AppBookingDialog, IframeContentLoadedDirective, BandcampWidgetSrcDirective
								],
	entryComponents: [ AppContactDialog, AppDemoDialog, AppBookingDialog ],
	imports 		: [ BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule,
									FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule.forRoot(APP_ROUTES)
								],
	providers 	: [ { provide: APP_BASE_HREF, useValue: '/' }, { provide: LocationStrategy, useClass: PathLocationStrategy },
									{ provide: 'Window', useValue: window }, TRANSLATION_PROVIDERS, TranslateService,
									CustomServiceWorkerService, CustomDeferredService, CustomHttpHandlersService, EventEmitterService,
									GoogleApiService, FirebaseService, SendEmailService, SendDemoService, SendBookingRequestService,
									EmailSubscriptionService, SoundcloudService, BandcampService, FacebookService
								],
	schemas 		: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap 	: [ AppComponent ]
})
export class AppModule {}
