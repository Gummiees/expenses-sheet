import { Component } from '@angular/core';
import { TypeName } from '@shared/models/type.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public expenseType = TypeName.expense;
  public incomeType = TypeName.income;
}
