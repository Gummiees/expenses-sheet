import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MainWorkflowService {
  private _unsavedChanges: boolean = false;
  constructor() {}

  public get unsavedChanges(): boolean {
    return this._unsavedChanges;
  }

  public set unsavedChanges(changes: boolean) {
    this._unsavedChanges = changes;
  }

  public removeChanges() {
    this._unsavedChanges = false;
  }
}
