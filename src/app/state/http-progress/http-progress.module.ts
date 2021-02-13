import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { httpProgressServiceProvider } from './http-progress.service';
import { AppHttpProgressState } from './http-progress.store';

export const httpProgressModuleProviders: Provider[] = [httpProgressServiceProvider];

@NgModule({
  imports: [NgxsModule.forFeature([AppHttpProgressState])],
  providers: [...httpProgressModuleProviders],
})
export class AppHttpProgressStoreModule {}
