import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-mixes',
  templateUrl: './mixes.component.html',
  styleUrls: ['./mixes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMixesComponent {
  @HostBinding('fxLayout') public fxLayout = 'row';

  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';
}
