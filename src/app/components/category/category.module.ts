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
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryTableComponent } from './category-table/category-table.component';
import { CategoryComponent } from './category.component';
import { CategoryComponentService } from './category.component.service';
import { CategoryRoutingModule } from './category.routes';

@NgModule({
  declarations: [CategoryComponent, CategoryTableComponent, CategoryFormComponent],
  imports: [
    RouterModule,
    SharedModule,
    CategoryRoutingModule,
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
  providers: [CategoryComponentService, DialogService]
})
export class CategoryModule {}
