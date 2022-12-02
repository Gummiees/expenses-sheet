import { Component, OnDestroy } from '@angular/core';
import { Type, TypeName } from '@shared/models/type.model';
import { Subscription } from 'rxjs';
import { TagComponentService } from './tag.component.service';
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html'
})
export class TagComponent implements OnDestroy {
  public incomeType?: Type;
  public expenseType?: Type;
  private subscription?: Subscription;

  constructor(public tagComponentService: TagComponentService) {
    this.subscription = this.tagComponentService.types$.subscribe((types) => {
      this.incomeType = types.find((type) => type.name === TypeName.income.toString());
      this.expenseType = types.find((type) => type.name === TypeName.expense.toString());
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
