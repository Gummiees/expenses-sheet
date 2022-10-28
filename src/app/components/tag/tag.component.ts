import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { Tag } from '@shared/models/tag.model';
import { Type, TypeName } from '@shared/models/type.model';
import { TagService } from '@shared/services/tag.service';
import { map, Observable, Subscription } from 'rxjs';
import { TagComponentService } from './tag.component.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnDestroy {
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public incomeTags$: Observable<Tag[]> = new Observable();
  public expenseTags$: Observable<Tag[]> = new Observable();
  private incomeType?: Type;
  private expenseType?: Type;
  private subscription?: Subscription;

  constructor(public tagComponentService: TagComponentService, private tagService: TagService) {
    this.subscription = this.tagComponentService.types$.subscribe((types) => {
      this.incomeType = types.find((type) => type.name === TypeName.income.toString());
      this.expenseType = types.find((type) => type.name === TypeName.expense.toString());
      this.incomeTags$ = this.tagComponentService.tags$.pipe(
        map((tags: Tag[]) => {
          return tags.filter((tag: Tag) => tag.typeId === this.incomeType?.id);
        })
      );
      this.expenseTags$ = this.tagComponentService.tags$.pipe(
        map((tags: Tag[]) => tags.filter((tag: Tag) => tag.typeId === this.expenseType?.id))
      );
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async remove(tag: Tag) {
    await this.tagService.deleteItem(tag);
  }

  async addExpense(name: string) {
    if (!name) {
      return;
    }
    debugger;
    const tag: Tag = {
      name,
      typeId: this.expenseType?.id
    };
    await this.tagService.createItem(tag);
  }

  async addIncome(name: string) {
    if (!name) {
      return;
    }

    const tag: Tag = {
      name,
      typeId: this.incomeType?.id
    };
    await this.tagService.createItem(tag);
  }
}
