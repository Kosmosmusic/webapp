import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './modules/custom-material.module';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { AppNavComponent } from './components/app-nav.component';
import { AppIndexComponent } from './components/app-index.component';
import { AppMasteringComponent } from './components/app-mastering.component';
import { AppMixesComponent } from './components/app-mixes.component';
import { AppVideosComponent } from './components/app-videos.component';
import { AppAboutComponent } from './components/app-about.component';
import { AppContactDialog } from './components/app-contact-dialog.component';
import { AppDemoDialog } from './components/app-demo-dialog.component';
import { AppBookingDialog } from './components/app-booking-dialog.component';
import { AppMasteringDialog } from './components/app-mastering-dialog.component';

import { SoundcloudPlayerComponent } from './components/soundcloud-player.component';
import { BassdrivePlayerComponent } from './components/bassdrive-player.component';

import { TranslateModule } from './modules/translate/index';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';
import { EventEmitterService } from './services/event-emitter.service';
import { UserInterfaceUtilsService } from './services/user-interface-utils.service';

import { GoogleApiService } from './services/google-api.service';
import { FirebaseService } from './services/firebase.service';
import { SendEmailService } from './services/send-email.service';
import { SendDemoService } from './services/send-demo.service';
import { SendMasteringOrderService } from './services/send-mastering-order.service';
import { SendBookingRequestService } from './services/send-booking-request.service';
import { EmailSubscriptionService } from './services/email-subscription.service';
import { SoundcloudService } from './services/soundcloud.service';
import { FacebookService } from './services/facebook.service';

import { IframeContentLoadedDirective } from './directives/iframe-content-loaded.directive';
import { ImageLoadedDirective } from './directives/image-loaded.directive';

import { ENV } from './app.environment';

@NgModule({
	declarations: [
		AppComponent, AppNavComponent, AppIndexComponent, AppMasteringComponent,
		AppMixesComponent, AppVideosComponent, AppAboutComponent, AppContactDialog,
		AppDemoDialog, AppBookingDialog, AppMasteringDialog,
		SoundcloudPlayerComponent, BassdrivePlayerComponent,
		IframeContentLoadedDirective, ImageLoadedDirective
	],
	entryComponents: [
		AppContactDialog, AppDemoDialog, AppBookingDialog, AppMasteringDialog
	],
	imports: [
		BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule,
		FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule.forRoot(),
		AngularFireModule.initializeApp(ENV.firebase, 'kosmosmusic'), AngularFireDatabaseModule,
		AppRoutingModule
	],
	providers: [
		{ provide: APP_BASE_HREF, useValue: '/' }, { provide: LocationStrategy, useClass: PathLocationStrategy },
		{ provide: 'Window', useValue: window }, { provide: ENV, useValue: ENV },
		CustomServiceWorkerService, CustomDeferredService,
		CustomHttpHandlersService, EventEmitterService, UserInterfaceUtilsService,
		GoogleApiService, FirebaseService, SendEmailService, SendDemoService, SendMasteringOrderService,
		SendBookingRequestService, EmailSubscriptionService, SoundcloudService, FacebookService
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
