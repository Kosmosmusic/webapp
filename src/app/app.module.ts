import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppEnvironmentConfig, ENV } from 'src/app/app.environment';
import { AppRoutingModule } from 'src/app/app.routing.module';
import { AppAboutComponent } from 'src/app/components/about/app-about.component';
import { AppComponent } from 'src/app/components/app/app.component';
import { BassdrivePlayerComponent } from 'src/app/components/bassdrive-player/bassdrive-player.component';
import { AppBookingDialog } from 'src/app/components/booking-dialog/app-booking-dialog.component';
import { AppContactDialog } from 'src/app/components/contact-dialog/app-contact-dialog.component';
import { AppDemoDialog } from 'src/app/components/demo-dialog/app-demo-dialog.component';
import { AppIndexComponent } from 'src/app/components/index/index.component';
import { AppMasteringComponent } from 'src/app/components/mastering/app-mastering.component';
import { AppMasteringDialog } from 'src/app/components/mastering-dialog/app-mastering-dialog.component';
import { AppMixesComponent } from 'src/app/components/mixes/app-mixes.component';
import { AppNavComponent } from 'src/app/components/nav/app-nav.component';
import { AppReleasesComponent } from 'src/app/components/releases/app-releases.component';
import { SoundcloudPlayerComponent } from 'src/app/components/soundcloud-player/soundcloud-player.component';
import { AppVideosComponent } from 'src/app/components/videos/app-videos.component';
import { AppDirectivesModule } from 'src/app/directives/directives.module';
import { AppMaterialModule } from 'src/app/modules/material/custom-material.module';
import { TranslateModule } from 'src/app/modules/translate/index';
import { AppServicesModule } from 'src/app/services/services.module';
import { environment } from 'src/environments/environment';

import { AppEventsComponent } from './components/events/events.component';

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
    AppContactDialog,
    AppDemoDialog,
    AppBookingDialog,
    AppMasteringDialog,
    // players
    SoundcloudPlayerComponent,
    BassdrivePlayerComponent,
  ],
  entryComponents: [AppContactDialog, AppDemoDialog, AppBookingDialog, AppMasteringDialog],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(ENV.firebase, 'kosmosmusic'),
    AngularFireDatabaseModule,
    AppServicesModule.forRoot(),
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
