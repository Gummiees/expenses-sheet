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
import { DayComponent } from './day/day.component';
import { HomeFormComponent } from './form/home-form.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routes';
import { HomeService } from './home.service';
import { WeekComponent } from './week/week.component';

@NgModule({
  declarations: [HomeComponent, HomeFormComponent, WeekComponent, DayComponent],
  imports: [
    CalendarModule,
    SharedModule,
    HomeRoutingModule,
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
  providers: [HomeService]
})
export class HomeModule {}
