import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@shared/guard/guard.service';
import { TagComponent } from './tag.component';

const routes: Routes = [{ path: '', component: TagComponent, canDeactivate: [CanDeactivateGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule {}
