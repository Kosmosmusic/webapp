import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule, NgxsLoggerPluginOptions } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppEnvironmentConfig, ENV } from './app.environment';
import { AppRoutingModule } from './app.routing.module';
import { AppAboutComponent } from './components/about/about.component';
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
import { AppProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { AppReleasesComponent } from './components/releases/releases.component';
import { AppRootComponent } from './components/root/root.component';
import { AppSoundcloudPlayerComponent } from './components/soundcloud-player/soundcloud-player.component';
import { AppVideosComponent } from './components/videos/videos.component';
import { AppDirectivesModule } from './directives/directives.module';
import { AppMaterialModule } from './modules/material/custom-material.module';
import { AppTranslateModule } from './modules/translate/translate.module';
import { AppHttpProgressStoreModule } from './state/http-progress/http-progress.module';
import { AppSoundcloudStoreModule } from './state/soundcloud/soundcloud.module';
import { APP_ENV, WINDOW } from './utils/injection-tokens';

const ngxsLoggerPluginOptions: NgxsLoggerPluginOptions = {
  collapsed: true,
  disabled: environment.production,
};

@NgModule({
  declarations: [
    AppRootComponent,
    AppNavComponent,
    AppIndexComponent,
    AppMasteringComponent,
    AppReleasesComponent,
    AppEventsComponent,
    AppMixesComponent,
    AppVideosComponent,
    AppAboutComponent,
    AppContactDialogComponent,
    AppDemoDialogComponent,
    AppBookingDialogComponent,
    AppMasteringDialogComponent,
    AppSoundcloudPlayerComponent,
    AppBassdrivePlayerComponent,
    AppProgressBarComponent,
  ],
  entryComponents: [
    AppContactDialogComponent,
    AppDemoDialogComponent,
    AppBookingDialogComponent,
    AppMasteringDialogComponent,
    AppProgressBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppTranslateModule,
    AngularFireModule.initializeApp(ENV.firebase, 'kosmosmusic'),
    AngularFireDatabaseModule,
    AppDirectivesModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(ngxsLoggerPluginOptions),
    AppSoundcloudStoreModule,
    AppHttpProgressStoreModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: WINDOW, useValue: window },
    { provide: APP_ENV, useValue: new AppEnvironmentConfig() },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppRootComponent],
})
export class AppModule {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
  ) {
    this.addIconsToRegistry();
  }

  /**
   * Adds icons to material icons registry.
   */
  private addIconsToRegistry(): void {
    /**
     * register fontawesome for usage in mat-icon by adding directives
     * fontSet="fab" fontIcon="fa-icon"
     * fontSet="fas" fontIcon="fa-icon"
     *
     * note: free plan includes only fab (font-awesome-brands) and fas (font-awesome-solid) groups
     *
     * icons reference: https://fontawesome.com/icons/
     */
    this.matIconRegistry.registerFontClassAlias('fontawesome');

    this.matIconRegistry.addSvgIcon(
      'logo-round',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/kosmos_circle.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'logo-square',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/kosmos_square.svg'),
    );
  }
}
