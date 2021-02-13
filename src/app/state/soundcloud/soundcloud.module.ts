import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AppSoundcloudService } from './soundcloud.service';
import { AppSoundcloudState } from './soundcloud.store';
import { AppSoundcloudApiService } from './soundcloud-api.service';

export const soundcloudStoreModuleProviders: Provider[] = [
  AppSoundcloudService,
  AppSoundcloudApiService,
];

@NgModule({
  imports: [NgxsModule.forFeature([AppSoundcloudState])],
})
export class AppSoundcloudStoreModule {}
