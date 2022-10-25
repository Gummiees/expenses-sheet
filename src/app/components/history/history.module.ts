import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { HistoryComponent } from './history.component';
import { HistoryRoutingModule } from './history.routes';

@NgModule({
  declarations: [HistoryComponent],
  imports: [
    CalendarModule,
    SharedModule,
    HistoryRoutingModule,
    AngularFireAuthModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    TableModule,
    MatTooltipModule
  ],
  exports: [],
  providers: []
})
export class HistoryModule {}
