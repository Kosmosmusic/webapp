import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import 'node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from 'src/app/modules/material/custom-material.module';

import { AppRoutingModule } from 'src/app/app.routing.module';

import { AppComponent } from 'src/app/components/app/app.component';
import { AppNavComponent } from 'src/app/components/nav/app-nav.component';
import { AppIndexComponent } from 'src/app/components/index/app-index.component';
import { AppMasteringComponent } from 'src/app/components/mastering/app-mastering.component';
import { AppMixesComponent } from 'src/app/components/mixes/app-mixes.component';
import { AppVideosComponent } from 'src/app/components/videos/app-videos.component';
import { AppAboutComponent } from 'src/app/components/about/app-about.component';
import { AppContactDialog } from 'src/app/components/contact-dialog/app-contact-dialog.component';
import { AppDemoDialog } from 'src/app/components/demo-dialog/app-demo-dialog.component';
import { AppBookingDialog } from 'src/app/components/booking-dialog/app-booking-dialog.component';
import { AppMasteringDialog } from 'src/app/components/mastering-dialog/app-mastering-dialog.component';

import { SoundcloudPlayerComponent } from 'src/app/components/soundcloud-player/soundcloud-player.component';
import { BassdrivePlayerComponent } from 'src/app/components/bassdrive-player/bassdrive-player.component';

import { TranslateModule } from 'src/app/modules/translate/index';

import { AppServicesModule } from 'src/app/services/services.module';
import { AppDirectivesModule } from 'src/app/directives/directives.module';

import { ENV, AppEnvironmentConfig } from 'src/app/app.environment';

@NgModule({
  declarations: [
    AppComponent, AppNavComponent, AppIndexComponent, AppMasteringComponent,
    AppMixesComponent, AppVideosComponent, AppAboutComponent, AppContactDialog,
    AppDemoDialog, AppBookingDialog, AppMasteringDialog,
    SoundcloudPlayerComponent, BassdrivePlayerComponent
  ],
  entryComponents: [
    AppContactDialog, AppDemoDialog, AppBookingDialog, AppMasteringDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase, 'kosmosmusic'),
    AngularFireDatabaseModule,
    AppServicesModule.forRoot(),
    AppDirectivesModule,
    AppRoutingModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: 'Window', useValue: window },
    { provide: 'ENV', useValue: new AppEnvironmentConfig() }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
