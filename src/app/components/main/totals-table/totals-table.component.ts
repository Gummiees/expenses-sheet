import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Entry } from '@shared/models/entry.model';
import { Type, TypeName } from '@shared/models/type.model';
import { getLast12Months } from '@shared/utils';
import moment from 'moment';
import { combineLatest, filter, Subscription } from 'rxjs';
import { MainComponentService } from '../main.component.service';
import { TotalsTable } from './totals-table.model';

@Component({
  selector: 'app-totals-table',
  templateUrl: './totals-table.component.html'
})
export class TotalsTableComponent implements OnDestroy {
  public displayedColumns: string[] = [
    'month',
    'income',
    'expenses',
    'total',
    'accumulatedTotal',
    'savingsPercentage'
  ];
  public entries: Entry[] = [];
  public dataSource: MatTableDataSource<TotalsTable>;

  private tableData: TotalsTable[] = this.getInitialData();
  private subscriptions: Subscription[] = [];
  constructor(public mainComponentService: MainComponentService) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.tableData;
    this.subscribeToEntries();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private getInitialData(): TotalsTable[] {
    return getLast12Months().map((month) => {
      return {
        month,
        expenses: 0,
        income: 0,
        savings: 0,
        savingsPercentage: 0,
        accumulatedSavings: 0,
        total: 0,
        accumulatedTotal: 0
      };
    });
  }

  private subscribeToEntries() {
    const sub = combineLatest([
      this.mainComponentService.entries$,
      this.mainComponentService.types$
    ])
      .pipe(filter(([entries, types]) => !!entries && !!types && !!types.length))
      .subscribe(([entries, types]) => {
        this.entries = this.sortEntriesByDate(entries);
        this.setTableData(this.entries, types);
        this.dataSource.data = this.tableData;
      });
    this.subscriptions.push(sub);
  }

  private setTableData(entries: Entry[], types: Type[]) {
    entries.forEach((entry) => this.assignEntryToTable(entry, types));
    this.calculateAccumulatedValues();
  }

  private calculateAccumulatedValues() {
    this.tableData.forEach((element, i) => {
      element.accumulatedTotal = this.getAccumulatedTotal(element.total, i);
    });
  }

  private sortEntriesByDate(entries: Entry[]): Entry[] {
    return entries.sort((entry1, entry2) => {
      if (moment(entry1.date).isAfter(entry2.date)) {
        return 1;
      }
      return -1;
    });
  }

  private assignEntryToTable(entry: Entry, types: Type[]) {
    const index = this.tableData.findIndex(
      (element) => element.month.getMonth() === entry.date.getMonth()
    );
    if (index === -1) {
      return;
    }
    const expenses = types.find((type) => type.name.toLowerCase() === TypeName.expense);
    let transformedEntry: TotalsTable;
    if (entry.typeId === expenses!.id) {
      transformedEntry = this.addExpense(entry, index);
    } else {
      transformedEntry = this.addIncome(entry, index);
    }
    this.tableData[index] = transformedEntry;
  }

  private addExpense(entry: Entry, elementIndex: number): TotalsTable {
    const element = this.tableData[elementIndex];
    const expenses = element.expenses + entry.amount;
    const total = element.income - expenses;
    const savingsPercentage = element.income !== 0 ? total / element.income : 0;
    const accumulatedTotal = this.getAccumulatedTotal(total, elementIndex);

    return {
      month: element.month,
      expenses,
      income: element.income,
      total,
      accumulatedTotal,
      savingsPercentage
    };
  }

  private addIncome(entry: Entry, elementIndex: number): TotalsTable {
    const element = this.tableData[elementIndex];
    const income = element.income + entry.amount;
    const total = income - element.expenses;
    const savingsPercentage = income !== 0 ? total / income : 0;
    const accumulatedTotal = this.getAccumulatedTotal(total, elementIndex);
    return {
      month: element.month,
      expenses: element.expenses,
      income,
      total,
      accumulatedTotal,
      savingsPercentage
    };
  }

  private getAccumulatedTotal(currentTotal: number, elementIndex: number): number {
    let accumulated = currentTotal;
    if (elementIndex !== 0) {
      for (let i = elementIndex - 1; i >= 0; i--) {
        accumulated += this.tableData[i].total;
      }
    }
    return accumulated;
  }
}
