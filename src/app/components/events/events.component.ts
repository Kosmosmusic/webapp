import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FacebookService } from 'src/app/services';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppEventsComponent implements AfterViewInit {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(private readonly facebookService: FacebookService) {}

  public ngAfterViewInit(): void {
    this.facebookService.renderFacebookWidget();
  }
}
