import { Component } from '@angular/core';
import { Tag } from '@shared/models/tag.model';
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html'
})
export class TagComponent {
  public createNewPressed = false;
  public selectedTag?: Tag;

  constructor() {}

  public onNew() {
    this.createNewPressed = true;
    this.selectedTag = undefined;
  }

  public clean() {
    this.createNewPressed = false;
    this.selectedTag = undefined;
  }
}
