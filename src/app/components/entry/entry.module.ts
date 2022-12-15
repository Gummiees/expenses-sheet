import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { EntryTableComponent } from './entry-table/entry-table.component';
import { EntryComponent } from './entry.component';
import { EntryComponentService } from './entry.component.service';
import { EntryRoutingModule } from './entry.routes';

@NgModule({
  declarations: [EntryComponent, EntryTableComponent],
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
    MatDialogModule
  ],
  providers: [EntryComponentService]
})
export class EntryModule {}
