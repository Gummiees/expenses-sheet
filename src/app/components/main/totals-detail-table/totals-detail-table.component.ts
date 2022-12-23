import { Component, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '@shared/models/category.model';
import { Entry } from '@shared/models/entry.model';
import { Tag } from '@shared/models/tag.model';
import { TypeName } from '@shared/models/type.model';
import { getLast12Months } from '@shared/utils';
import moment from 'moment';
import { combineLatest, filter, Subscription } from 'rxjs';
import { MainComponentService } from '../main.component.service';
import { TotalsDetailTable } from './totals-detail-table.model';

@Component({
  selector: 'app-totals-detail-table[typeName]',
  templateUrl: './totals-detail-table.component.html'
})
export class TotalsDetailTableComponent implements OnDestroy {
  public monthColumns: string[] = getLast12Months(this.selectedMonth).map((month) =>
    moment(month).format('MMM YY')
  );
  public displayedColumns: string[] = ['name', ...this.monthColumns, 'total', 'average'];
  public entries: Entry[] = [];
  public dataSource: MatTableDataSource<TotalsDetailTable>;
  public get selectedMonth(): Date {
    return this._selectedMonth;
  }

  @Input() public set selectedMonth(month: Date) {
    this._selectedMonth = month;
    this.setMonthColumns();
    this.entries = this.filterEntriesByDate(this.entriesByType);
    this.setTableValues(this.entries, this.categories, this.tags);
  }
  @Input() public typeName: TypeName = TypeName.expense;

  private entriesByType: Entry[] = [];
  private categories: Category[] = [];
  private tags: Tag[] = [];
  private subscriptions: Subscription[] = [];
  private _selectedMonth = new Date();
  constructor(public mainComponentService: MainComponentService) {
    this.dataSource = new MatTableDataSource();
    this.subscribeToEntries();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private subscribeToEntries() {
    const sub = combineLatest([
      this.mainComponentService.entries$,
      this.mainComponentService.categories$,
      this.mainComponentService.tags$,
      this.mainComponentService.types$
    ])
      .pipe(
        filter(
          ([entries, categories, tags, types]) =>
            !!entries && !!categories && !!tags && !!types && !!types.length
        )
      )
      .subscribe(([entries, categories, tags, types]) => {
        const type = types.find((type) => type.name === this.typeName);
        if (!type) {
          return;
        }
        this.entriesByType = entries.filter((entry) => type.id === entry.typeId);
        this.entries = this.filterEntriesByDate(this.entriesByType);
        this.categories = [...categories];
        this.tags = [...tags];
        this.setTableValues(this.entries, this.categories, this.tags);
      });
    this.subscriptions.push(sub);
  }

  private filterEntriesByDate(entries: Entry[]): Entry[] {
    const last12Months = getLast12Months(this.selectedMonth);
    return entries.filter((entry) =>
      moment(entry.date).isBetween(last12Months[0], last12Months[11])
    );
  }

  private setTableValues(entries: Entry[], categories: Category[], tags: Tag[]) {
    const usedCategories = this.getUsedCategories(this.entries, categories);
    const usedTags = this.getUsedTags(this.entries, tags);
    const table = this.transformEntriesToTable(entries, usedCategories, usedTags);
    this.dataSource.data = table;
  }

  private getUsedCategories(entries: Entry[], categories: Category[]): Category[] {
    return categories.filter((category) =>
      entries.some((entry) => entry.categoryIds.some((categoryId) => categoryId === category.id))
    );
  }

  private getUsedTags(entries: Entry[], tags: Tag[]): Tag[] {
    return tags.filter((tag) =>
      entries.some((entry) => entry.tagIds.some((tagId) => tagId === tag.id))
    );
  }

  private getAmounts(entries: Entry[]): number[] {
    return getLast12Months(this.selectedMonth).map((month) => {
      const monthlyEntries = entries.filter((entry) => entry.date.getMonth() === month.getMonth());
      return monthlyEntries
        .map((entry) => entry.amount)
        .reduce((partialSum, current) => partialSum + current, 0);
    });
  }

  private getTotal(entries: Entry[]): number {
    return entries
      .map((entry) => entry.amount)
      .reduce((partialSum, current) => partialSum + current, 0);
  }

  private getAverage(entries: Entry[]): number {
    if (!entries.length) {
      return 0;
    }
    const total = this.getTotal(entries);
    if (total === 0) {
      return 0;
    }
    return Math.round((this.getTotal(entries) / entries.length) * 100) / 100;
  }

  private setMonthColumns() {
    this.monthColumns = getLast12Months(this.selectedMonth).map((month) =>
      moment(month).format('MMM YY')
    );
    this.setDisplayedColumns();
  }

  private setDisplayedColumns() {
    this.displayedColumns = ['name', ...this.monthColumns, 'total', 'average'];
  }

  private transformEntriesToTable(
    entries: Entry[],
    categories: Category[],
    tags: Tag[]
  ): TotalsDetailTable[] {
    let table: TotalsDetailTable[] = [];
    categories.forEach((category) => {
      const entriesWithCategory = entries.filter((entry) =>
        entry.categoryIds.some((categoryId) => categoryId === category.id)
      );
      const amount = this.getAmounts(entriesWithCategory);
      const total = this.getTotal(entriesWithCategory);
      const average = this.getAverage(entriesWithCategory);

      const element: TotalsDetailTable = {
        name: category.name,
        total,
        average,
        amount,
        isCategory: true
      };
      table.push(element);

      const tagsWithCategory = tags.filter((tag) => category.tagIds.includes(tag.id!));
      table = [...table, ...this.transformEntriesToTablePerTags(entries, tagsWithCategory)];
    });

    return table;
  }

  private transformEntriesToTablePerTags(entries: Entry[], tags: Tag[]): TotalsDetailTable[] {
    const table: TotalsDetailTable[] = [];
    tags.forEach((tag) => {
      const entriesWithTag = entries.filter((entry) =>
        entry.tagIds.some((tagId) => tagId === tag.id)
      );
      const amount = this.getAmounts(entriesWithTag);
      const total = this.getTotal(entriesWithTag);
      const average = this.getAverage(entriesWithTag);
      const element: TotalsDetailTable = {
        name: tag.name,
        total,
        average,
        amount,
        isCategory: false
      };
      table.push(element);
    });
    return table;
  }
}
