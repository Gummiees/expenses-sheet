import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@shared/guard/guard.service';
import { AddEntryComponent } from './add-entry.component';

const routes: Routes = [
  { path: '', component: AddEntryComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEntryRoutingModule {}
