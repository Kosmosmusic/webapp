import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppIndexComponent } from 'src/app/components/index/app-index.component';
import { AppMasteringComponent } from 'src/app/components/mastering/app-mastering.component';
import { AppReleasesComponent } from './components/releases/app-releases.component';
import { AppMixesComponent } from 'src/app/components/mixes/app-mixes.component';
import { AppVideosComponent } from 'src/app/components/videos/app-videos.component';
import { AppAboutComponent } from 'src/app/components/about/app-about.component';
import { AppEventsComponent } from './components/events/app-events.component';

export const APP_ROUTES: Routes = [
  { path: 'index', component: AppIndexComponent },
  { path: 'mastering', component: AppMasteringComponent },
  { path: 'releases', component: AppReleasesComponent },
  { path: 'events', component: AppEventsComponent },
  { path: 'mixes', component: AppMixesComponent },
  { path: 'videos', component: AppVideosComponent },
  { path: 'about', component: AppAboutComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full'},
  { path: '**', redirectTo: 'index' }
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [ RouterModule.forRoot(APP_ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
