import { Component } from '@angular/core';
import { Category } from '@shared/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent {
  public createNewPressed = false;
  public selectedCategory?: Category;

  constructor() {}

  public onNew() {
    this.createNewPressed = true;
    this.selectedCategory = undefined;
  }

  public clean() {
    this.createNewPressed = false;
    this.selectedCategory = undefined;
  }
}
