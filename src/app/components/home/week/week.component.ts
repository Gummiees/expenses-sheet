import { Component, OnDestroy } from '@angular/core';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { TimeSheet, TimeSheetTable } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { CommonService } from '@shared/services/common.service';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html'
})
export class WeekComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  public tableEntries: TimeSheetTable[] = [];
  public today: number = Date.now();
  private diff: number = 0;
  private daily: { day: string; diff: number; isWrong: boolean }[] = [];
  private subscriptions: Subscription[] = [];
  private intervalFunction: any;
  private entriesLoaded: boolean = false;
  private typesLoaded: boolean = false;
  private clonedEntries: { [s: string]: TimeSheetTable } = {};
  constructor(
    public commonService: CommonService,
    private loadersService: LoadersService,
    private homeService: HomeService,
    private timeSheetService: TimeSheetService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  ngOnDestroy(): void {
    this.clearIntervalDiff();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading;
  }

  public getDiffString(): string {
    return this.homeService.getDiffString(this.diff);
  }

  public getDiffStringItem(item: TimeSheetTable): string {
    const diff: number = this.getDaily(item)?.diff ?? 0;
    return this.homeService.getDiffString(diff);
  }

  public isDayWrong(item: TimeSheetTable): boolean {
    return this.getDaily(item)?.isWrong || false;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  public async onDelete(entry: TimeSheetTable) {
    const dialogModel: BasicDialogModel = {
      body: 'Are you sure you want to delete the entry?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete(this.mapTableEntry(entry)));
  }

  public onRowEditInit(entry: TimeSheetTable) {
    if (!entry.id) {
      return;
    }
    this.clonedEntries[entry.id] = { ...entry };
  }

  public async onRowEditSave(entry: TimeSheetTable) {
    if (!entry.id) {
      return;
    }
    this.loadersService.timeSheetLoading = true;
    try {
      await this.timeSheetService.updateItem(this.mapTableEntry(entry));
      this.messageService.showOk('Entry saved successfully');
      delete this.clonedEntries[entry.id];
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.timeSheetLoading = false;
  }

  public onRowEditCancel(entry: TimeSheetTable, rowIndex: number) {
    if (!entry.id) {
      return;
    }
    this.entries[rowIndex] = this.clonedEntries[entry.id];
    delete this.clonedEntries[entry.id];
  }

  private setIntervalDiff() {
    if (!this.intervalFunction) {
      this.intervalFunction = setInterval(
        () => (this.diff += this.homeService.updateInterval),
        this.homeService.updateInterval
      );
    }
  }

  private getDiff() {
    if (this.entriesLoaded && this.typesLoaded && this.types.length > 0) {
      this.diff = this.homeService.setTotalTime(this.types, this.entries);
      if (this.homeService.lastCheckoutExists(this.types, this.entries)) {
        this.clearIntervalDiff();
      } else {
        this.setIntervalDiff();
      }
    }
  }

  private clearIntervalDiff() {
    if (this.intervalFunction) {
      clearInterval(this.intervalFunction);
      this.intervalFunction = undefined;
    }
  }

  private async delete(entry: TimeSheet) {
    this.loadersService.timeSheetLoading = true;
    try {
      await this.timeSheetService.deleteItem(entry);
      this.messageService.showOk('Entry created successfully');
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.timeSheetLoading = false;
  }

  private subscribeToTypes() {
    const sub: Subscription = this.homeService.types$.subscribe((types) => {
      this.types = [...types];
      this.typesLoaded = true;
      this.getDiff();
    });
    this.subscriptions.push(sub);
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
      const sub: Subscription = this.homeService.entries$.subscribe((entries: TimeSheet[]) => {
        this.entries = entries.filter((entry) => this.homeService.isCurrentWeek(entry.date));
        this.entriesLoaded = true;
        this.getDiff();
        this.prepareTable();
      });
      this.subscriptions.push(sub);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }

  private prepareTable() {
    this.tableEntries = this.mapEntries(this.entries);
    if (this.tableEntries.length === 0) {
      return;
    }
    const days: Set<string> = new Set(this.tableEntries.map((entry) => entry.onlyDate));
    this.daily = [];
    days.forEach((day) => {
      const entries: TimeSheet[] = this.entries.filter((entry) =>
        moment(day, 'YYYY-MM-DD').isSame(entry.date, 'day')
      );
      const diff: number = this.homeService.setTotalTime(this.types, entries);
      const isWrong: boolean = !this.homeService.lastCheckoutExists(this.types, entries);
      this.daily.push({ day, diff, isWrong });
    });
  }

  private mapEntries(entries: TimeSheet[]): TimeSheetTable[] {
    return entries.map((entry) => this.mapEntry(entry));
  }

  private mapEntry(entry: TimeSheet): TimeSheetTable {
    return {
      ...entry,
      onlyDate: moment(entry.date).format('YYYY-MM-DD')
    };
  }

  private mapTableEntry(tableEntry: TimeSheetTable): TimeSheet {
    return {
      id: tableEntry.id,
      userId: tableEntry.userId,
      date: tableEntry.date,
      typeId: tableEntry.typeId
    };
  }

  private getDaily(
    item: TimeSheetTable
  ): { day: string; diff: number; isWrong: boolean } | undefined {
    return this.daily.find((diff) => moment(diff.day, 'YYYY-MM-DD').isSame(item.date, 'day'));
  }
}
