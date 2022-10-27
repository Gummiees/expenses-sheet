import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { TagComponent } from './tag.component';
import { TagRoutingModule } from './tag.routes';
import { TagService } from './tag.service';

@NgModule({
  declarations: [TagComponent],
  imports: [RouterModule, SharedModule, TagRoutingModule],
  providers: [TagService]
})
export class TagModule {}
