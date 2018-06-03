import { Routes } from '@angular/router';
import { AppIndexComponent } from './components/app-index.component';

export const APP_ROUTES: Routes = [
	{ path: 'index', component: AppIndexComponent },
	{ path: 'releases', component: AppIndexComponent },
	{ path: 'mastering', component: AppIndexComponent },
	{ path: 'mixes', component: AppIndexComponent },
	{ path: 'videos', component: AppIndexComponent },
	{ path: 'about', component: AppIndexComponent },
	{ path: '', redirectTo: 'index', pathMatch: 'full'},
	{ path: '**', redirectTo: 'index' }
];
