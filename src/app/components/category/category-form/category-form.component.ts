import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@shared/models/category.model';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { Subscription } from 'rxjs';
import { CategoryComponentService } from '../category.component.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnDestroy {
  public form: FormGroup = new FormGroup({});
  public nameControl: FormControl = new FormControl(null, [Validators.required]);
  public typeControl: FormControl = new FormControl(null, [Validators.required]);
  public tagsControl: FormControl = new FormControl([]);
  private idControl: FormControl = new FormControl(null);

  public types: Type[] = [];
  public tags: Tag[] = [];
  private _selected?: Category;
  private subscriptions: Subscription[] = [];

  @Input() public set selected(s: Category | undefined) {
    this._selected = s;
    this.updateForm(s);
  }
  public get selected(): Category | undefined {
    return this._selected;
  }
  @Output() public cancel: EventEmitter<void> = new EventEmitter();

  constructor(public categoryComponentService: CategoryComponentService) {
    this.setForm();
    this.subscribeToTags();
    this.subscribeToTypes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public onSubmit() {
    console.log('on submit');
    console.log(this.form.value);
  }

  public onCancel() {
    this.cancel.emit();
  }

  public isTagSelected(tag: Tag): boolean {
    if (!this.form.controls.tags.value || this.form.controls.tags.value.length === 0) {
      return false;
    }

    const currentTagControlValue: Tag[] = this.form.controls.tags.value;
    return currentTagControlValue.some((controlTag) => controlTag.id! === tag.id!);
  }

  public onTagClicked(tag: Tag) {
    const currentTagControlValue: Tag[] = this.form.controls.tags.value;

    if (this.isTagSelected(tag)) {
      const tagValues = currentTagControlValue.filter((controlTag) => controlTag.id! !== tag.id!);
      this.form.controls.tags.setValue(tagValues);
    } else {
      this.form.controls.tags.setValue([tag, ...currentTagControlValue]);
    }
  }

  private updateForm(category?: Category) {
    this.form.patchValue({
      id: category?.id,
      name: category?.name,
      type: this.types.find((type) => type.id === category?.typeId),
      tags: category ? this.tags.filter((tag) => category?.tagIds.includes(tag.id!)) : []
    });

    if (category) {
      this.form.controls.tags.setValue(
        this.tags.filter((tag) => category.tagIds.includes(tag.id!))
      );
    }
  }

  private setForm() {
    this.form = new FormGroup({
      id: this.idControl,
      name: this.nameControl,
      type: this.typeControl,
      tags: this.tagsControl
    });
  }

  private subscribeToTags() {
    const sub = this.categoryComponentService.types$.subscribe(
      (types) => (this.types = [...types])
    );
    this.subscriptions.push(sub);
  }

  private subscribeToTypes() {
    const sub = this.categoryComponentService.tags$.subscribe((tags) => (this.tags = [...tags]));
    this.subscriptions.push(sub);
  }
}
