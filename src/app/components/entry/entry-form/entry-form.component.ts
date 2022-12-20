import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '@shared/models/category.model';
import { Entry } from '@shared/models/entry.model';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { EntryService } from '@shared/services/entry.service';
import { MessageService } from '@shared/services/message.service';
import { Subscription } from 'rxjs';
import { EntryComponentService } from '../entry.component.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html'
})
export class EntryFormComponent implements OnDestroy {
  public today: Date = new Date();
  public form: FormGroup = new FormGroup({});
  public descriptionControl: FormControl<string | null> = new FormControl<string | null>(null, [
    Validators.required
  ]);
  public amountControl: FormControl<number | null> = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0)
  ]);
  public dateControl: FormControl<Date | null> = new FormControl<Date>(new Date(), [
    Validators.required
  ]);
  public typeControl: FormControl<Type | null> = new FormControl<Type | null>(null, [
    Validators.required
  ]);
  public categoriesControl: FormControl<Category[]> = new FormControl<Category[]>([], {
    nonNullable: true,
    validators: [Validators.required]
  });
  public tagsControl: FormControl<Tag[]> = new FormControl<Tag[]>([], { nonNullable: true });
  private idControl: FormControl<string | null> = new FormControl<string | null>(null);

  public types: Type[] = [];
  public categories: Category[] = [];
  public tags: Tag[] = [];
  private _selected?: Entry;
  private subscriptions: Subscription[] = [];

  @Input() public set selected(s: Entry | undefined) {
    this._selected = s;
    this.updateForm(s);
  }
  public get selected(): Entry | undefined {
    return this._selected;
  }
  @Output() public save: EventEmitter<void> = new EventEmitter();
  @Output() public cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    public entryComponentService: EntryComponentService,
    private entryService: EntryService,
    private messageService: MessageService
  ) {
    this.setForm();
    this.subscribeToTypes();
    this.subscribeToTypeControl();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public async onSubmit() {
    const entry = this.mapFormToEntry();
    this.form.disable();
    if (!!this.selected) {
      entry.id = this.idControl.value!;
      await this.entryService.updateItem(entry);
    } else {
      await this.entryService.createItem(entry);
    }
    this.save.emit();
    this.messageService.showOk('Entry saved successfully');
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

    const currentCategoryControlValue: Category[] = this.form.controls.categories.value;
    return currentCategoryControlValue.some(
      (controlCategory) => controlCategory.id! === category.id!
    );
  }

  public onCategoryClicked(category: Category) {
    const currentCategoryControlValue: Category[] = this.form.controls.categories.value;

    if (this.isCategorySelected(category)) {
      const categoryValues = currentCategoryControlValue.filter(
        (controlCategory) => controlCategory.id! !== category.id!
      );
      this.form.controls.categories.setValue(categoryValues);
    } else {
      this.form.controls.categories.setValue([category, ...currentCategoryControlValue]);
    }
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

  private mapFormToEntry(): Entry {
    if (this.form.invalid) {
      throw new Error('Form is invalid!');
    }

    const categories: Category[] = this.categoriesControl.value;
    const categoryIds = categories.map((category) => category.id!);

    const tags: Tag[] = this.tagsControl.value;
    const tagIds = tags.map((tag) => tag.id!);

    debugger;

    return {
      description: this.descriptionControl.value!,
      amount: this.amountControl.value!,
      date: this.dateControl.value!,
      typeId: this.typeControl.value!.id!,
      categoryIds,
      tagIds
    };
  }

  private updateForm(entry?: Entry) {
    this.form.patchValue({
      id: entry?.id,
      description: entry?.description,
      type: this.types.find((type) => type.id === entry?.typeId),
      categories: entry
        ? this.categories.filter((category) => entry?.categoryIds.includes(category.id!))
        : [],
      tags: entry ? this.tags.filter((tag) => entry?.tagIds.includes(tag.id!)) : []
    });

    if (entry) {
      this.form.controls.tags.setValue(this.tags.filter((tag) => entry.tagIds.includes(tag.id!)));
      this.form.controls.categories.setValue(
        this.categories.filter((category) => entry.categoryIds.includes(category.id!))
      );
    }
  }

  private setForm() {
    this.form = new FormGroup({
      id: this.idControl,
      name: this.descriptionControl,
      amount: this.amountControl,
      date: this.dateControl,
      type: this.typeControl,
      categories: this.categoriesControl,
      tags: this.tagsControl
    });
  }

  private subscribeToCategories() {
    const sub = this.entryComponentService.categories$.subscribe((categories) => {
      this.categories = categories.filter(
        (category) => category.typeId === this.typeControl.value!.id
      );
      this.resetSelectedCategories();
    });
    this.subscriptions.push(sub);
  }

  private resetSelectedCategories() {
    if (!this.typeControl.value || !this.selected) {
      this.categoriesControl.setValue([]);
      return;
    }

    const categories = this.categories.filter((category) =>
      this.selected!.categoryIds.includes(category.id!)
    );

    this.categoriesControl.setValue([...categories]);
  }

  private subscribeToTags() {
    const sub = this.entryComponentService.tags$.subscribe((tags) => {
      this.tags = tags.filter((tag) => tag.typeId === this.typeControl.value!.id);
      this.tags = this.tags.filter((tag) =>
        this.categoriesControl.value.some((category) =>
          category.tagIds.some((tagId) => tagId === tag.id)
        )
      );
      this.resetSelectedTags();
    });
    this.subscriptions.push(sub);
  }

  private resetSelectedTags() {
    if (!this.typeControl.value || !this.selected) {
      this.tagsControl.setValue([]);
      return;
    }

    const tags = this.tags.filter((tag) => this.selected!.tagIds.includes(tag.id!));

    this.tagsControl.setValue([...tags]);
  }

  private subscribeToTypes() {
    const sub = this.entryComponentService.types$.subscribe((types) => (this.types = [...types]));
    this.subscriptions.push(sub);
  }

  private subscribeToTypeControl() {
    const sub = this.typeControl.valueChanges.subscribe((val) => {
      if (!!val) {
        this.subscribeToCategories();
        this.subscribeToCategoriesControl();
      } else {
        this.tags = [];
      }
    });
    this.subscriptions.push(sub);
  }

  private subscribeToCategoriesControl() {
    const sub = this.categoriesControl.valueChanges.subscribe((val) => {
      if (!!val) {
        this.subscribeToTags();
      } else {
        this.tags = [];
      }
    });
    this.subscriptions.push(sub);
  }
}
