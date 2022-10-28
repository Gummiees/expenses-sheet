import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@shared/models/category.model';
import { CategoryComponentService } from './category.component.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  public categories: Category[] = [];
  public selectedCategory: Category | null = null;
  public form: FormGroup = new FormGroup({});
  public selectorControl: FormControl = new FormControl(null);
  public nameControl: FormControl = new FormControl(null, [Validators.required]);
  public typeControl: FormControl = new FormControl(null, [Validators.required]);

  constructor(public categoryService: CategoryComponentService) {
    this.setForms();
  }

  public onSubmit() {}

  private setForms() {
    this.form = new FormGroup({
      selector: this.selectorControl,
      name: this.nameControl,
      type: this.typeControl
    });
  }
}
