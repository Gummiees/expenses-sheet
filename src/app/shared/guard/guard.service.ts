import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { DialogService } from '@shared/services/dialog.service';
import { WorkflowService } from '@shared/services/workflow.service';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private workflowService: WorkflowService, private dialogService: DialogService) {}
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.workflowService.unsavedChanges) {
      const dialogModel: BasicDialogModel = {
        body: 'There are unsaved changes. Are you sure you want to leave?'
      };
      this.dialogService
        .openDialog(dialogModel, true)
        .pipe(first())
        .subscribe((value: any) => {
          const undoChanges: boolean = value === true;
          if (undoChanges) {
            this.workflowService.removeChanges();
          }
          of(undoChanges);
        });
    }
    return of(true);
  }
}
