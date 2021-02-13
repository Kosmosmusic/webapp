import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppReleasesComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;
}
