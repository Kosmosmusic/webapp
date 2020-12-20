import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SoundcloudService } from 'src/app/services/index';

@UntilDestroy()
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIndexComponent implements OnDestroy {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(private readonly soundcloudService: SoundcloudService) {}

  public ngOnDestroy(): void {
    this.soundcloudService.resetServiceData();
  }
}
