import { Component } from '@angular/core';
import { Entry } from '@shared/models/entry.model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html'
})
export class EntryComponent {
  public createNewPressed = false;
  public selectedEntry?: Entry;

  constructor() {}

  public onNew() {
    this.createNewPressed = true;
    this.selectedEntry = undefined;
  }

  public clean() {
    this.createNewPressed = false;
    this.selectedEntry = undefined;
  }
}
