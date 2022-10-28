import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { TagService } from '@shared/services/tag.service';
import { map, Observable, Subscription } from 'rxjs';
import { TagComponentService } from '../tag.component.service';
@Component({
  selector: 'app-tag-by-type',
  templateUrl: './tag-by-type.component.html'
})
export class TagByTypeComponent implements OnDestroy {
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public tags: Tag[] = [];
  public noUserTags: Tag[] = [];
  public tagCtrl = new FormControl('');
  public filteredTagNames: Observable<string[]> = new Observable();
  @Input() public set type(t: Type | undefined) {
    if (!t) {
      return;
    }
    this._type = t;
    this.subscribeToTags();
  }
  public get type(): Type | undefined {
    return this._type;
  }
  private _type?: Type;
  private subscriptions: Subscription[] = [];

  @ViewChild('chipInput') public chipInput?: ElementRef<HTMLInputElement>;

  constructor(public tagComponentService: TagComponentService, private tagService: TagService) {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async remove(tag: Tag) {
    await this.tagService.deleteItem(tag);
  }

  async add(event: MatChipInputEvent) {
    if (!event.value) {
      return;
    }
    this.create(event.value);
    event.chipInput.clear();
  }

  async selected(event: MatAutocompleteSelectedEvent) {
    if (!event.option.viewValue) {
      return;
    }
    await this.create(event.option.viewValue);
    this.tagCtrl.setValue(null);
    if (this.chipInput) {
      this.chipInput.nativeElement.value = '';
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.noUserTags
      .map((tag) => tag.name)
      .filter(
        (name) =>
          name.toLowerCase().includes(filterValue) &&
          !this.tags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())
      );
  }

  private async create(name: string) {
    if (!name) {
      return;
    }
    const tag: Tag = {
      name: name,
      typeId: this.type?.id
    };
    await this.tagService.createItem(tag);
  }

  private subscribeToTags() {
    const tagsSub = this.tagComponentService.tags$
      .pipe(
        map((tags: Tag[]) => {
          return tags.filter((tag: Tag) => tag.typeId === this.type?.id);
        })
      )
      .subscribe((tags) => {
        this.tags = [...tags];
        this.subscribeToNoUserTags();
      });
    this.subscriptions.push(tagsSub);
  }

  private subscribeToNoUserTags() {
    const noUserTagsSub = this.tagComponentService.noUserTags$
      .pipe(map((tags: Tag[]) => tags.filter((tag: Tag) => tag.typeId === this.type?.id)))
      .subscribe((tags) => {
        this.noUserTags = [...tags];
        this.filteredTagNames = this.tagCtrl.valueChanges.pipe(
          map((name: string | null) => {
            if (name) {
              return this.filter(name);
            }
            return this.noUserTags
              .filter(
                (noUserTag) =>
                  !this.tags.some((tag) => tag.name.toLowerCase() === noUserTag.name.toLowerCase())
              )
              .map((tag) => tag.name)
              .slice();
          })
        );
      });
    this.subscriptions.push(noUserTagsSub);
  }
}
