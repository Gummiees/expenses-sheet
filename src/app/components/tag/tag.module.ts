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
import { DialogService } from '@shared/services/dialog.service';
import { SharedModule } from '@shared/shared.module';
import { MessageService } from 'primeng/api';
import { TagFormComponent } from './tag-form/tag-form.component';
import { TagTableComponent } from './tag-table/tag-table.component';
import { TagComponent } from './tag.component';
import { TagComponentService } from './tag.component.service';
import { TagRoutingModule } from './tag.routes';

@NgModule({
  declarations: [TagComponent, TagFormComponent, TagTableComponent],
  imports: [
    RouterModule,
    SharedModule,
    TagRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatChipsModule
  ],
  providers: [TagComponentService, DialogService, MessageService]
})
export class TagModule {}
