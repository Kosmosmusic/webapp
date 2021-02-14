import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mixes',
  templateUrl: './mixes.component.html',
  styleUrls: ['./mixes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMixesComponent {}
