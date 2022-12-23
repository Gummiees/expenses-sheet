import { Component } from '@angular/core';
import { TypeName } from '@shared/models/type.model';
import { getLast12Months } from '@shared/utils';
import moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public selectedMonth = new Date();
  public firstMonth = getLast12Months(this.selectedMonth)[0];
  public expenseType = TypeName.expense;
  public incomeType = TypeName.income;

  public onMoveLeft() {
    const newMonth = moment(this.selectedMonth).subtract(1, 'month').toDate();
    this.onChangeSelectedMonth(newMonth);
  }

  public onMoveRight() {
    const newMonth = moment(this.selectedMonth).add(1, 'month').toDate();
    this.onChangeSelectedMonth(newMonth);
  }

  private onChangeSelectedMonth(month: Date) {
    this.selectedMonth = month;
    this.firstMonth = getLast12Months(this.selectedMonth)[0];
  }
}
