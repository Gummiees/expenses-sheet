import { Injectable } from '@angular/core';
import { HomeWorkflowService } from 'src/app/components/home/home.workflow.service';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private _unsavedChanges: boolean = false;
  constructor(private homeService: HomeWorkflowService) {}

  public get unsavedChanges(): boolean {
    return this._unsavedChanges || this.homeService.unsavedChanges;
  }

  public set unsavedChanges(changes: boolean) {
    this._unsavedChanges = changes;
  }

  public removeChanges() {
    this._unsavedChanges = false;
    this.homeService.unsavedChanges = false;
  }
}
