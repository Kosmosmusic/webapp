import { InjectionToken } from '@angular/core';

import { IEnvironmentInterface } from '../interfaces/app-environment/app-environment.interface';

export const WINDOW = new InjectionToken<Window>('Window');

export const APP_ENV = new InjectionToken<IEnvironmentInterface>('APP_ENV');
