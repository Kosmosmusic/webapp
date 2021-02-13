import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';

import { AppSoundcloudService } from './soundcloud.service';

describe('DnbhubSoundcloudService', () => {
  let service: AppSoundcloudService;

  const testBedConfig: TestModuleMetadata = {
    providers: [],
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
