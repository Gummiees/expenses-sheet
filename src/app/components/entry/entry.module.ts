import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { EntryComponent } from './entry.component';
import { EntryRoutingModule } from './entry.routes';
import { EntryService } from './entry.service';

@NgModule({
  declarations: [EntryComponent],
  imports: [RouterModule, SharedModule, EntryRoutingModule],
  providers: [EntryService]
})
export class EntryModule {}
