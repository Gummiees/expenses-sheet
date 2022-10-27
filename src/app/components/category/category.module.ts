import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category.routes';
import { CategoryService } from './category.service';

@NgModule({
  declarations: [CategoryComponent],
  imports: [RouterModule, SharedModule, CategoryRoutingModule],
  providers: [CategoryService]
})
export class CategoryModule {}
