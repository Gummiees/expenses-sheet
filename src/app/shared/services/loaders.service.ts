import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private $signInLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private $userInfoLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private $typeLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private $timeSheetLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}

  isAnyLoading(): boolean {
    return this.signInLoading || this.userInfoLoading || this.typeLoading || this.timeSheetLoading;
  }
  set signInLoading(value: boolean) {
    this.$signInLoading.next(value);
  }
  get signInLoading(): boolean {
    return this.$signInLoading.value;
  }
  set userInfoLoading(value: boolean) {
    this.$userInfoLoading.next(value);
  }
  get userInfoLoading(): boolean {
    return this.$userInfoLoading.value;
  }
  set typeLoading(value: boolean) {
    this.$typeLoading.next(value);
  }
  get typeLoading(): boolean {
    return this.$typeLoading.value;
  }
  set timeSheetLoading(value: boolean) {
    this.$timeSheetLoading.next(value);
  }
  get timeSheetLoading(): boolean {
    return this.$timeSheetLoading.value;
  }
}
