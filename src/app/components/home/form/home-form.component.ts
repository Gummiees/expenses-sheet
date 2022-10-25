import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { CommonService } from '@shared/services/common.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home-form',
  templateUrl: './home-form.component.html'
})
export class HomeFormComponent implements OnDestroy {
  public types: Type[] = [];
  public form: FormGroup = new FormGroup({});
  public typeControl: FormControl = new FormControl(null, [Validators.required]);
  public dateControl: FormControl = new FormControl(this.currentDate(), [Validators.required]);
  private subscriptions: Subscription[] = [];
  constructor(
    public commonService: CommonService,
    private loadersService: LoadersService,
    private homeService: HomeService,
    private timeSheetService: TimeSheetService,
    private messageService: MessageService
  ) {
    this.setForms();
    this.subscribeToTypes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading;
  }

  public isDisabled(): boolean {
    return this.isLoading() || this.form.invalid;
  }

  async onSubmit() {
    if (this.form.valid && this.typeControl.value) {
      this.loadersService.userInfoLoading = true;
      try {
        await this.createEntry();
        this.messageService.showOk('Entry created successfully');
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.userInfoLoading = false;
    }
  }

  private async createEntry() {
    const entry: TimeSheet = {
      typeId: this.typeControl.value,
      date: this.dateControl.value
    };
    return this.timeSheetService.createItem(entry);
  }

  private setForms() {
    this.form = new FormGroup({
      type: this.dateControl,
      date: this.dateControl
    });
  }

  private currentDate(): Date {
    const date: Date = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      this.getMinutes(date)
    );
  }

  private getMinutes(date: Date): number {
    return date.getMinutes() % 15 === 0
      ? date.getMinutes()
      : date.getMinutes() - (date.getMinutes() % 15);
  }

  private subscribeToTypes() {
    const sub: Subscription = this.homeService.types$.subscribe((types) => {
      this.types = [...types];
    });
    this.subscriptions.push(sub);
  }
}
