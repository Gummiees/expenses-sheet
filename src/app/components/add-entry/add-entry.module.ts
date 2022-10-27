import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AddEntryComponent } from './add-entry.component';
import { AddEntryRoutingModule } from './add-entry.routes';
import { AddEntryService } from './add-entry.service';

@NgModule({
  declarations: [AddEntryComponent],
  imports: [RouterModule, SharedModule, AddEntryRoutingModule],
  providers: [AddEntryService]
})
export class AddEntryModule {}
