import { Injectable } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type, TypeName } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HomeService {
  private types: Type[] = [];
  public updateInterval: number = 60000;
  private entries: TimeSheet[] = [];
  public types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>(this.types || []);
  public entries$: BehaviorSubject<TimeSheet[]> = new BehaviorSubject<TimeSheet[]>(
    this.entries || []
  );
  constructor(
    private loadersService: LoadersService,
    private userService: UserService,
    private timeSheetService: TimeSheetService,
    private typeService: TypeService
  ) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  public getDiffString(diff: number): string {
    const duration: any = moment.duration(diff);
    return `${duration.get('days') * 24 + duration.get('hours')}H ${duration.get('minutes')}m`;
  }

  public isToday(date: Date) {
    if (!date || !(date instanceof Date)) {
      return false;
    }
    return moment(date).isSame(new Date(), 'day');
  }

  public isCurrentWeek(date: Date) {
    if (!date || !(date instanceof Date)) {
      return false;
    }
    return moment(date).isSame(new Date(), 'week');
  }

  public setTotalTime(types: Type[], entries: TimeSheet[]): number {
    const checkins: TimeSheet[] = this.getEntriesByType(TypeName.checkin, types, entries).reverse();
    const checkouts: TimeSheet[] = this.getEntriesByType(
      TypeName.checkout,
      types,
      entries
    ).reverse();

    let allCheckinsHaveCheckouts: boolean = true;
    let diff: number = 0;

    checkins.forEach((checkin) => {
      const checkout: TimeSheet | undefined = checkouts.find(
        (out) =>
          moment(checkin.date).isSame(out.date, 'day') && moment(checkin.date).isBefore(out.date)
      );
      if (!checkout) {
        allCheckinsHaveCheckouts = false;
        return;
      }
      diff += moment(checkout.date).diff(moment(checkin.date));
    });

    if (!allCheckinsHaveCheckouts && checkins.length > 0) {
      const lastCheckin: TimeSheet = checkins[checkins.length - 1];
      diff += moment(new Date()).diff(lastCheckin.date);
      diff = Math.abs(diff);
    } else {
      diff = diff;
    }

    return diff;
  }

  public lastCheckoutExists(types: Type[], entries: TimeSheet[]): boolean {
    const checkins: TimeSheet[] = this.getEntriesByType(TypeName.checkin, types, entries);
    const checkouts: TimeSheet[] = this.getEntriesByType(TypeName.checkout, types, entries);
    let allCheckinsHaveCheckouts: boolean = true;
    checkins.forEach((checkin) => {
      const checkout: TimeSheet | undefined = checkouts.find(
        (out) =>
          moment(checkin.date).isSame(out.date, 'day') && moment(checkin.date).isBefore(out.date)
      );
      if (!checkout) {
        allCheckinsHaveCheckouts = false;
        return;
      }
    });
    return !checkins.length || allCheckinsHaveCheckouts;
  }

  private getEntriesByType(typeName: TypeName, types: Type[], entries: TimeSheet[]): TimeSheet[] {
    const typeId: string | undefined = types.find((type) => type.name === typeName)?.id;
    return entries.filter((entry) => entry.typeId === typeId);
  }

  private subscribeToTypes() {
    this.typeService.listItems().subscribe((types) => {
      this.types = [...types];
      this.types$.next(this.types);
    });
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
      const user: firebase.User | null = await this.userService.user;
      if (user) {
        this.timeSheetService.listItems(user).subscribe((entries: TimeSheet[]) => {
          this.entries = [...entries];
          this.entries$.next(this.entries);
        });
      } else {
        throw new Error('You must be logged in to view categories');
      }
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }
}
