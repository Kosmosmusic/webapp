import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { AppReleasesComponent } from './components/app-releases.component';
import { AppMasteringComponent } from './components/app-mastering.component';
import { AppMixesComponent } from './components/app-mixes.component';
import { AppVideosComponent } from './components/app-videos.component';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './modules/translate/index';

import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';
import { EventEmitterService } from './services/event-emitter.service';

import { GoogleApiService } from './services/google-api.service';

@NgModule({
	declarations: [ AppComponent, TranslatePipe, AppNavComponent, AppIndexComponent, AppReleasesComponent,
									AppMasteringComponent, AppMixesComponent, AppVideosComponent
								],
	imports 		: [ BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule,
									FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule.forRoot(APP_ROUTES)
								],
	providers 	: [ {provide: APP_BASE_HREF, useValue: '/'}, {provide: LocationStrategy, useClass: PathLocationStrategy},
									{ provide: 'Window', useValue: window }, TRANSLATION_PROVIDERS, TranslateService,
									CustomServiceWorkerService, CustomDeferredService, CustomHttpHandlersService, EventEmitterService,
									GoogleApiService
								],
	schemas 		: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap 	: [ AppComponent ]
})
export class AppModule {}
