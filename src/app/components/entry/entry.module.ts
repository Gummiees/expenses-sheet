import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryTableComponent } from './entry-table/entry-table.component';
import { EntryComponent } from './entry.component';
import { EntryComponentService } from './entry.component.service';
import { EntryRoutingModule } from './entry.routes';

@NgModule({
  declarations: [EntryComponent, EntryTableComponent, EntryFormComponent],
  imports: [
    RouterModule,
    SharedModule,
    EntryRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
  ],
  providers: [EntryComponentService]
})
export class EntryModule {}
