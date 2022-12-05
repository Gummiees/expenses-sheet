import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@shared/models/category.model';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { CategoryService } from '@shared/services/category.service';
import { MessageService } from '@shared/services/message.service';
import { TagService } from '@shared/services/tag.service';
import { Subscription } from 'rxjs';
import { TagComponentService } from '../tag.component.service';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html'
})
export class TagFormComponent implements OnDestroy {
  public form: FormGroup = new FormGroup({});
  public nameControl: FormControl = new FormControl(null, [Validators.required]);
  public typeControl: FormControl = new FormControl(null, [Validators.required]);
  public categoriesControl: FormControl = new FormControl([]);
  private idControl: FormControl = new FormControl(null);

  public types: Type[] = [];
  public categories: Category[] = [];
  private originalCategories: Category[] = [];
  private selectedCategories: Category[] = [];
  private allCategories: Category[] = [];
  private _selected?: Tag;
  private subscriptions: Subscription[] = [];

  @Input() public set selected(s: Tag | undefined) {
    this._selected = s;
    this.listCategories();
    this.updateForm(s);
  }
  public get selected(): Tag | undefined {
    return this._selected;
  }
  @Output() public save: EventEmitter<void> = new EventEmitter();
  @Output() public cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    public tagComponentService: TagComponentService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {
    this.setForm();
    this.subscribeToTypes();
    this.subscribeToTypeControl();
    this.subscribeToAllCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public async onSubmit() {
    const tag = this.mapFormToTag();
    const categories = this.categoriesControl.value;
    this.form.disable();

    if (!!this.selected) {
      tag.id = this.idControl.value;
      await this.tagService.updateItem(tag);
    } else {
      tag.id = await this.tagService.createItem(tag);
    }
    this.updateCategories(categories, tag.id!);
    this.save.emit();
    this.messageService.showOk('Tag saved successfully');
    this.form.enable();
    this.form.reset();
  }

  public onCancel() {
    this.cancel.emit();
  }

  public isCategorySelected(category: Category): boolean {
    if (!this.form.controls.categories.value || this.form.controls.categories.value.length === 0) {
      return false;
    }

    const currentCategoriesControlValue: Category[] = this.form.controls.categories.value;
    return currentCategoriesControlValue.some(
      (controlCategory) => controlCategory.id! === category.id!
    );
  }

  public onCategoryClicked(category: Category) {
    const currentCategoriesControlValue: Category[] = this.form.controls.categories.value;

    if (this.isCategorySelected(category)) {
      const categoryValues = currentCategoriesControlValue.filter(
        (controlCategory) => controlCategory.id! !== category.id!
      );
      this.form.controls.categories.setValue(categoryValues);
    } else {
      this.form.controls.categories.setValue([category, ...currentCategoriesControlValue]);
    }
  }

  private mapFormToTag(): Tag {
    if (this.form.invalid) {
      throw new Error('Form is invalid!');
    }

    return {
      name: this.nameControl.value,
      typeId: this.typeControl.value.id
    };
  }

  private updateCategories(selectedCategories: Category[], selectedTagId: string) {
    this.tagComponentService.removeUnselectedCategoriesByTagId(selectedTagId, selectedCategories);
    this.updateAddedCategories(selectedCategories, selectedTagId);
  }

  private updateAddedCategories(selectedCategories: Category[], selectedTagId: string) {
    const newCategories = selectedCategories.filter((selectedCategory) => {
      return !this.originalCategories.some(
        (originalCategory) => selectedCategory.id! === originalCategory.id!
      );
    });

    newCategories.forEach((category) => {
      const updatedCategory: Category = {
        ...category,
        tagIds: [...category.tagIds, selectedTagId]
      };
      this.categoryService.updateItem(updatedCategory);
    });
  }

  private updateForm(tag?: Tag) {
    this.form.patchValue({
      id: tag?.id,
      name: tag?.name,
      type: this.types.find((type) => type.id === tag?.typeId),
      categories: this.categories
    });
  }

  private setForm() {
    this.form = new FormGroup({
      id: this.idControl,
      name: this.nameControl,
      type: this.typeControl,
      categories: this.categoriesControl
    });
  }

  private subscribeToTypes() {
    const sub = this.tagComponentService.types$.subscribe((types) => (this.types = [...types]));
    this.subscriptions.push(sub);
  }

  private subscribeToTypeControl() {
    this.typeControl.valueChanges.subscribe(() => this.filterCategoriesBySelectedType());
  }

  private filterCategoriesBySelectedType() {
    if (!this.typeControl.value) {
      this.categories = [];
      return;
    }
    this.categories = this.allCategories.filter(
      (category) => category.typeId === this.typeControl.value.id!
    );
    this.selectedCategories = this.categories.filter((category) =>
      this.originalCategories.some((original) => original.id! === category.id!)
    );
    this.categoriesControl.setValue([...this.selectedCategories]);
  }

  private async subscribeToAllCategories() {
    const sub = this.tagComponentService.categories$.subscribe((categories) => {
      this.allCategories = [...categories];
    });
    this.subscriptions.push(sub);
  }

  private async listCategories() {
    if (!this.selected) {
      this.originalCategories = [];
      this.filterCategoriesBySelectedType();
      return;
    }
    const obs = await this.tagComponentService.getCategories(this.selected!.id);
    const sub = obs.subscribe((categories) => {
      if (this.selected?.id) {
        this.originalCategories = [...categories];
      } else {
        this.originalCategories = [];
      }
      this.filterCategoriesBySelectedType();
    });
    this.subscriptions.push(sub);
  }
}
