import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BasicDialogComponent,
  BasicDialogData
} from '@shared/components/basic-dialog/basic-dialog.component';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(model: BasicDialogModel, removeFalses?: boolean): Observable<boolean> {
    const data: BasicDialogData = {
      header: model.header,
      body: model.body
    };
    const dialogRef = this.dialog.open(BasicDialogComponent, {
      width: model.width ?? '500px',
      data: data
    });

    return dialogRef.afterClosed().pipe(
      first(),
      filter((result) => !removeFalses || (removeFalses && !!result)),
      map((result) => !!result)
    );
  }

  openGenericDialog<T>(component: ComponentType<T>, data?: any, width?: string): Observable<any> {
    const dialogRef = this.dialog.open(component, {
      data: data,
      width: width ?? '100%'
    });

    return dialogRef.afterClosed().pipe(first());
  }
}
