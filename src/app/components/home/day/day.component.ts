import { Component, OnDestroy } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type, TypeName } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  public now: Date = new Date();
  private diff: number = 0;
  private intervalFunction: any;
  private intervalNow: any;
  private subscriptions: Subscription[] = [];
  private entriesLoaded: boolean = false;
  private typesLoaded: boolean = false;
  private reversedEntries: TimeSheet[] = [];
  constructor(private loadersService: LoadersService, private homeService: HomeService) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
    this.setIntervalNow();
  }

  ngOnDestroy(): void {
    this.clearIntervalDiff();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    clearInterval(this.intervalNow);
  }

  public getDiffString(): string {
    return this.homeService.getDiffString(this.diff);
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading || this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId?: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  public isCheckin(typeId?: string) {
    return this.getTypeName(typeId) === TypeName.checkin;
  }

  public isLastEntry(i: number): boolean {
    return this.reversedEntries.length - 1 === i;
  }

  public lastCheckoutExists(): boolean {
    return this.homeService.lastCheckoutExists(this.types, this.reversedEntries);
  }

  private getDiff() {
    if (this.entriesLoaded && this.typesLoaded && this.types.length > 0) {
      this.diff = this.homeService.setTotalTime(this.types, this.reversedEntries);
      if (this.homeService.lastCheckoutExists(this.types, this.reversedEntries)) {
        this.clearIntervalDiff();
      } else {
        this.setIntervalDiff();
      }
    }
  }

  private setIntervalDiff() {
    if (!this.intervalFunction) {
      this.intervalFunction = setInterval(
        () => (this.diff += this.homeService.updateInterval),
        this.homeService.updateInterval
      );
    }
  }

  private clearIntervalDiff() {
    if (this.intervalFunction) {
      clearInterval(this.intervalFunction);
      this.intervalFunction = undefined;
    }
  }

  private subscribeToTypes() {
    const sub: Subscription = this.homeService.types$.subscribe((types: Type[]) => {
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
        this.reversedEntries = entries.filter((entry) => this.homeService.isToday(entry.date));
        this.entries = [...this.reversedEntries].reverse();
        this.entriesLoaded = true;
        this.getDiff();
      });
      this.subscriptions.push(sub);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }

  private setIntervalNow() {
    if (!this.intervalNow) {
      this.intervalNow = setInterval(
        () => (this.now = new Date()),
        this.homeService.updateInterval
      );
    }
  }
}
