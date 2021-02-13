import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AppSoundcloudService } from './soundcloud.service';
import { AppSoundcloudState } from './soundcloud.store';
import { AppSoundcloudApiService } from './soundcloud-api.service';

describe('DnbhubSoundcloudService', () => {
  let service: AppSoundcloudService;

  const testBedConfig: TestModuleMetadata = {
    imports: [MatSnackBarModule, NgxsModule.forRoot([AppSoundcloudState]), HttpClientTestingModule],
    providers: [
      {
        provide: AppSoundcloudService,
        useFactory: (store: Store, api: AppSoundcloudApiService) =>
          new AppSoundcloudService(store, api),
        deps: [Store, AppSoundcloudApiService],
      },
      {
        provide: AppSoundcloudApiService,
        useValue: {
          connect: () => void 0,
          getMe: () => of(),
          getMyPlaylists: () => of(),
          getUserTracks: () => of(),
          getPlaylist: () => of(),
          streamTrack: () => of(),
          getLinkWithId: () => of(),
          resetServiceData: () => void 0,
        },
      },
    ],
  };

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule(testBedConfig)
        .compileComponents()
        .then(() => {
          service = TestBed.inject(AppSoundcloudService);
        });
    }),
  );

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
