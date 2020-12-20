import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { AppFacebookService } from '../../services/facebook/facebook.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppEventsComponent implements AfterViewInit {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(private readonly facebookService: AppFacebookService) {}

  public ngAfterViewInit(): void {
    this.facebookService.renderFacebookWidget();
  }
}
