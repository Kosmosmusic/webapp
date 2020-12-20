import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppEnvironmentConfig, ENV } from './app.environment';
import { AppRoutingModule } from './app.routing.module';
import { AppAboutComponent } from './components/about/about.component';
import { AppComponent } from './components/app/app.component';
import { AppBassdrivePlayerComponent } from './components/bassdrive-player/bassdrive-player.component';
import { AppBookingDialogComponent } from './components/booking-dialog/booking-dialog.component';
import { AppContactDialogComponent } from './components/contact-dialog/contact-dialog.component';
import { AppDemoDialogComponent } from './components/demo-dialog/demo-dialog.component';
import { AppEventsComponent } from './components/events/events.component';
import { AppIndexComponent } from './components/index/index.component';
import { AppMasteringComponent } from './components/mastering/mastering.component';
import { AppMasteringDialogComponent } from './components/mastering-dialog/mastering-dialog.component';
import { AppMixesComponent } from './components/mixes/mixes.component';
import { AppNavComponent } from './components/nav/nav.component';
import { AppReleasesComponent } from './components/releases/releases.component';
import { SoundcloudPlayerComponent } from './components/soundcloud-player/soundcloud-player.component';
import { AppVideosComponent } from './components/videos/videos.component';
import { AppDirectivesModule } from './directives/directives.module';
import { AppMaterialModule } from './modules/material/custom-material.module';
import { AppTranslateModule } from './modules/translate/translate.module';

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    AppIndexComponent,
    AppMasteringComponent,
    AppReleasesComponent,
    AppEventsComponent,
    AppMixesComponent,
    AppVideosComponent,
    AppAboutComponent,
    // dialogs
    AppContactDialogComponent,
    AppDemoDialogComponent,
    AppBookingDialogComponent,
    AppMasteringDialogComponent,
    // players
    SoundcloudPlayerComponent,
    AppBassdrivePlayerComponent,
  ],
  entryComponents: [
    AppContactDialogComponent,
    AppDemoDialogComponent,
    AppBookingDialogComponent,
    AppMasteringDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppTranslateModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase, 'kosmosmusic'),
    AngularFireDatabaseModule,
    AppDirectivesModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: 'Window', useValue: window },
    { provide: 'ENV', useValue: new AppEnvironmentConfig() },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
