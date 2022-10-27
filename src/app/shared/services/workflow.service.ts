import { Injectable } from '@angular/core';
import { MainWorkflowService } from 'src/app/components/main/main.workflow.service';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private _unsavedChanges: boolean = false;
  constructor(private mainWorkflowService: MainWorkflowService) {}

  public get unsavedChanges(): boolean {
    return this._unsavedChanges || this.mainWorkflowService.unsavedChanges;
  }

  public set unsavedChanges(changes: boolean) {
    this._unsavedChanges = changes;
  }

  public removeChanges() {
    this._unsavedChanges = false;
    this.mainWorkflowService.unsavedChanges = false;
  }
}
