import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Indeterminate progress bar.
 * Use with component portals.
 */
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProgressBarComponent {}
