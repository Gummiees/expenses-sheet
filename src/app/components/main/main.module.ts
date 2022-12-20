import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@shared/shared.module';
import { MainComponent } from './main.component';
import { MainComponentService } from './main.component.service';
import { MainRoutingModule } from './main.routes';
import { MainService } from './main.service';
import { TotalsTableComponent } from './totals-table/totals-table.component';

@NgModule({
  declarations: [MainComponent, TotalsTableComponent],
  imports: [
    SharedModule,
    MainRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatTableModule
  ],
  providers: [MainService, MainComponentService]
})
export class MainModule {}
