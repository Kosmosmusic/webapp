import { Routes } from '@angular/router';
import { AppIndexComponent } from './components/app-index.component';
import { AppMasteringComponent } from './components/app-mastering.component';
import { AppMixesComponent } from './components/app-mixes.component';
import { AppVideosComponent } from './components/app-videos.component';
import { AppAboutComponent } from './components/app-about.component';

export const APP_ROUTES: Routes = [
	{ path: 'index', component: AppIndexComponent },
	{ path: 'mastering', component: AppMasteringComponent },
	{ path: 'mixes', component: AppMixesComponent },
	{ path: 'videos', component: AppVideosComponent },
	{ path: 'about', component: AppAboutComponent },
	{ path: '', redirectTo: 'index', pathMatch: 'full'},
	{ path: '**', redirectTo: 'index' }
];
