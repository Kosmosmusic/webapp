import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { take, tap } from 'rxjs/operators';

import { httpProgressActions } from '../../state/http-progress/http-progress.store';
import { AppMasteringDialogComponent } from '../mastering-dialog/mastering-dialog.component';

@Component({
  selector: 'app-mastering',
  templateUrl: './mastering.component.html',
  styleUrls: ['./mastering.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMasteringComponent implements OnInit {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

  /**
   * Component details object.
   */
  public details: Record<string, unknown> = {};

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance?: MatDialogRef<AppMasteringDialogComponent>;

  /**
   * Should be called once iframe content finished loading.
   */
  public contentLoaded(): void {
    void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
  }

  /**
   * Shows mastering dialog.
   */
  public showMasteringDialog(): void {
    this.dialogInstance = this.dialog.open(AppMasteringDialogComponent, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {},
    });
    void this.dialogInstance
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          this.dialogInstance = void 0;
        }),
      )
      .subscribe();
  }

  public ngOnInit(): void {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
  }
}
