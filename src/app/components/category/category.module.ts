import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryComponentService } from './category.component.service';
import { CategoryRoutingModule } from './category.routes';

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    RouterModule,
    SharedModule,
    CategoryRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [CategoryComponentService]
})
export class CategoryModule {}
