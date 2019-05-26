import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FacebookService } from 'src/app/services';

@Component({
  selector: 'app-events',
  templateUrl: './app-events.html',
  styleUrls: ['./app-events.scss'],
  host: {
    class: 'mat-body-1'
  }
})
export class AppEventsComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private facebookService: FacebookService
  ) {}

  public ngOnInit(): void {
    console.log('ngOnInit: AppEventsComponent initialized');
  }

  /**
   * Lifecycle hook called after component view is initialized.
   */
  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit: AppIndexComponent view initialized');
    this.facebookService.renderFacebookWidget();
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppEventsComponent destroyed');
  }

}
